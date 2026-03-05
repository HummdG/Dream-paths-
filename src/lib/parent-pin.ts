import { randomInt } from 'crypto'
import { hash, compare } from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

export const PARENT_PIN_COOKIE = 'parent_verified'

const BCRYPT_ROUNDS = 10
const PIN_TTL_MINUTES = 15
const COOKIE_TTL_HOURS = 2

function getJwtSecret(): Uint8Array {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) throw new Error('NEXTAUTH_SECRET is not set')
  return new TextEncoder().encode(secret)
}

/** Returns a random 6-digit PIN string (cryptographically secure). */
export function generatePin(): string {
  return randomInt(100000, 1000000).toString()
}

/** Hashes a PIN with bcrypt. */
export async function hashPin(pin: string): Promise<string> {
  return hash(pin, BCRYPT_ROUNDS)
}

/** Constant-time comparison via bcrypt. */
export async function verifyPin(pin: string, pinHash: string): Promise<boolean> {
  return compare(pin, pinHash)
}

/** Returns a Date 15 minutes from now. */
export function pinExpiryDate(): Date {
  return new Date(Date.now() + PIN_TTL_MINUTES * 60 * 1000)
}

/** Signs a 2-hour JWT for the parent dashboard cookie. */
export async function signParentCookie(parentId: string): Promise<string> {
  return new SignJWT({ parentId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${COOKIE_TTL_HOURS}h`)
    .sign(getJwtSecret())
}

/** Verifies the parent dashboard cookie JWT. Returns parentId or null. */
export async function verifyParentCookie(token: string): Promise<{ parentId: string; expired: false } | { parentId: null; expired: boolean }> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret())
    const parentId = payload.parentId as string
    if (!parentId) return { parentId: null, expired: false }
    return { parentId, expired: false }
  } catch (err: unknown) {
    const isExpired =
      err instanceof Error && err.message.includes('exp')
    return { parentId: null, expired: isExpired }
  }
}

/** Cookie options for the parent verified cookie. */
export function cookieOptions(expiresAt: Date): Parameters<Awaited<ReturnType<typeof cookies>>['set']>[2] {
  return {
    httpOnly: true,
    path: '/parent-dashboard',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
  }
}
