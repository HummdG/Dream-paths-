import { NextRequest, NextResponse } from 'next/server'
import { compare } from 'bcryptjs'
import { prisma } from '@/lib/db'
import { signAdminCookie, adminCookieOptions, ADMIN_COOKIE } from '@/lib/admin-auth'
import { checkRateLimit, getClientIp, rateLimitedResponse } from '@/lib/rate-limit'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers)
  const rl = checkRateLimit(`admin-login:${ip}`, 10, 15 * 60 * 1000)
  if (!rl.allowed) return rateLimitedResponse(rl.resetAt)

  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  }

  const admin = await prisma.admin.findUnique({
    where: { email: email.toLowerCase() },
  })

  if (!admin) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 })
  }

  const valid = await compare(password, admin.passwordHash)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 })
  }

  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000)
  const token = await signAdminCookie(admin.id, admin.email)

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_COOKIE, token, adminCookieOptions(expiresAt))

  return NextResponse.json({ success: true })
}
