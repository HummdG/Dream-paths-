/**
 * In-process sliding-window rate limiter.
 *
 * State is scoped to a single Node.js process. On Vercel this means
 * limits are per warm Lambda instance, not global. At low concurrency
 * (< ~50 req/s) this is sufficient — a single warm instance handles
 * the vast majority of traffic. For global enforcement, replace the
 * Map with an Upstash Redis client.
 */

type Entry = { count: number; resetAt: number };

// Module-level — shared across all requests on the same instance.
const store = new Map<string, Entry>();

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * @param key     Unique identifier (e.g. `register:1.2.3.4`)
 * @param limit   Max requests allowed in the window
 * @param windowMs Window duration in milliseconds
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: limit - entry.count,
    resetAt: entry.resetAt,
  };
}

/** Extract the real client IP from Next.js request headers. */
export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}

/** Return a 429 Response with a Retry-After header. */
export function rateLimitedResponse(resetAt: number): Response {
  const retryAfterSeconds = Math.ceil((resetAt - Date.now()) / 1000);
  return new Response(
    JSON.stringify({ error: "Too many requests. Please try again later." }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfterSeconds),
      },
    }
  );
}
