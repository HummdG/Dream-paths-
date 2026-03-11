import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/email'
import { checkRateLimit, getClientIp, rateLimitedResponse } from '@/lib/rate-limit'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  // 5 submissions per IP per hour — prevents inbox flooding and Resend quota drain
  const ip = getClientIp(req.headers)
  const rl = checkRateLimit(`contact:${ip}`, 5, 60 * 60 * 1000)
  if (!rl.allowed) return rateLimitedResponse(rl.resetAt)

  const body = await req.json()
  const { name, email, type, message } = body

  if (!name || !email || !type || !message) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }

  const validTypes = ['question', 'complaint', 'feedback', 'help']
  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: 'Invalid type.' }, { status: 400 })
  }

  // Persist to DB for admin review — fire and forget, don't block on failure
  prisma.contactSubmission.create({ data: { name, email, type, message } }).catch(() => {})

  const result = await sendContactEmail(name, email, type, message)

  if (!result.success) {
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
