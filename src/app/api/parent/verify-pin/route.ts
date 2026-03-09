import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { verifyPin, signParentCookie, PARENT_PIN_COOKIE, cookieOptions } from '@/lib/parent-pin'
import { checkRateLimit, rateLimitedResponse } from '@/lib/rate-limit'

const PIN_REGEX = /^\d{6}$/

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const parentId = session.user.id

  // 5 attempts per 15 minutes per parent — prevents brute forcing the 6-digit PIN
  const rl = checkRateLimit(`verify-pin:${parentId}`, 5, 15 * 60 * 1000)
  if (!rl.allowed) return rateLimitedResponse(rl.resetAt)

  let pin: string
  try {
    const body = await request.json()
    pin = body?.pin
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!pin || !PIN_REGEX.test(pin)) {
    return NextResponse.json({ error: 'PIN must be a 6-digit number' }, { status: 400 })
  }

  // Find the most recent unused, non-expired PIN for this parent
  const storedPin = await prisma.parentAccessPin.findFirst({
    where: {
      parentId,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  })

  if (!storedPin) {
    return NextResponse.json({ error: 'No valid PIN found. Please request a new one.' }, { status: 400 })
  }

  const isValid = await verifyPin(pin, storedPin.pinHash)
  if (!isValid) {
    return NextResponse.json({ error: 'Incorrect PIN. Please try again.' }, { status: 400 })
  }

  // Mark PIN as used (one-time use)
  await prisma.parentAccessPin.update({
    where: { id: storedPin.id },
    data: { usedAt: new Date() },
  })

  // Issue the 2-hour cookie
  const cookieExpiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000)
  const token = await signParentCookie(parentId)

  const response = NextResponse.json({ ok: true })
  response.cookies.set(PARENT_PIN_COOKIE, token, cookieOptions(cookieExpiresAt))

  return response
}
