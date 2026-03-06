import { NextRequest, NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, type, message } = body

  if (!name || !email || !type || !message) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }

  const validTypes = ['question', 'complaint', 'feedback', 'help']
  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: 'Invalid type.' }, { status: 400 })
  }

  const result = await sendContactEmail(name, email, type, message)

  if (!result.success) {
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
