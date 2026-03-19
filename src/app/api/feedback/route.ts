import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/email'
import { checkRateLimit, getClientIp, rateLimitedResponse } from '@/lib/rate-limit'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers)
  const rl = checkRateLimit(`feedback:${ip}`, 10, 60 * 60 * 1000)
  if (!rl.allowed) return rateLimitedResponse(rl.resetAt)

  const body = await req.json()
  const { message, email, page } = body

  if (!message || typeof message !== 'string' || message.trim().length < 3) {
    return NextResponse.json({ error: 'Please write a message.' }, { status: 400 })
  }

  const trimmedMessage = page
    ? `[Page: ${page}]\n\n${message.trim()}`
    : message.trim()

  const name = 'Feedback Widget'
  const senderEmail = email?.trim() || 'noreply@feedback.internal'

  prisma.contactSubmission
    .create({ data: { name, email: senderEmail, type: 'feedback', message: trimmedMessage } })
    .catch(() => {})

  await sendContactEmail(name, senderEmail, 'feedback', trimmedMessage)

  return NextResponse.json({ success: true })
}
