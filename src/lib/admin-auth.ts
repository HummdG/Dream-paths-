import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

export const ADMIN_COOKIE = 'admin_session'
const COOKIE_TTL_HOURS = 8

function getJwtSecret(): Uint8Array {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) throw new Error('NEXTAUTH_SECRET is not set')
  return new TextEncoder().encode(secret + ':admin') // separate namespace from parent cookies
}

/** Signs an 8-hour JWT for the admin session cookie. */
export async function signAdminCookie(adminId: string, email: string): Promise<string> {
  return new SignJWT({ adminId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${COOKIE_TTL_HOURS}h`)
    .sign(getJwtSecret())
}

/** Verifies the admin session cookie. Returns payload or null. */
export async function verifyAdminCookie(
  token: string
): Promise<{ adminId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    const adminId = payload.adminId as string
    const email = payload.email as string
    if (!adminId || !email) return null
    return { adminId, email }
  } catch {
    return null
  }
}

/** Reads and verifies the admin cookie from the current request. Returns payload or null. */
export async function getAdminSession(): Promise<{ adminId: string; email: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_COOKIE)?.value
  if (!token) return null
  return verifyAdminCookie(token)
}

/** Cookie options for the admin session cookie. */
export function adminCookieOptions(expiresAt: Date): Parameters<Awaited<ReturnType<typeof cookies>>['set']>[2] {
  return {
    httpOnly: true,
    path: '/admin',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
  }
}
