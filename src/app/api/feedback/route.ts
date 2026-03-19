import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/email'
import { checkRateLimit, getClientIp, rateLimitedResponse } from '@/lib/rate-limit'
import { prisma } from '@/lib/db'

const MAX_BODY_BYTES = 20_000 // 20 KB — well above any legitimate feedback
const MAX_MESSAGE_CHARS = 2_000
const MAX_PAGE_CHARS = 200

export async function POST(req: NextRequest) {
  // Reject oversized bodies before parsing JSON
  const contentLength = Number(req.headers.get('content-length') ?? 0)
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Request too large.' }, { status: 413 })
  }

  const ip = getClientIp(req.headers)
  const rl = checkRateLimit(`feedback:${ip}`, 5, 60 * 60 * 1000)
  if (!rl.allowed) return rateLimitedResponse(rl.resetAt)

  const body = await req.json()
  const { message, email, page } = body

  if (!message || typeof message !== 'string' || message.trim().length < 3) {
    return NextResponse.json({ error: 'Please write a message.' }, { status: 400 })
  }

  if (message.length > MAX_MESSAGE_CHARS) {
    return NextResponse.json({ error: 'Message is too long.' }, { status: 400 })
  }

  const safePage =
    typeof page === 'string' ? page.slice(0, MAX_PAGE_CHARS) : null

  const trimmedMessage = safePage
    ? `[Page: ${safePage}]\n\n${message.trim()}`
    : message.trim()

  const name = 'Feedback Widget'
  const senderEmail = email?.trim() || 'noreply@feedback.internal'

  try {
    await prisma.contactSubmission.create({
      data: { name, email: senderEmail, type: 'feedback', message: trimmedMessage },
    })
  } catch (err) {
    console.error('Failed to save feedback submission:', err)
    return NextResponse.json({ error: 'Failed to save feedback. Please try again.' }, { status: 500 })
  }

  sendContactEmail(name, senderEmail, 'feedback', trimmedMessage).catch((err) =>
    console.error('Failed to send feedback email:', err)
  )

  return NextResponse.json({ success: true })
}
