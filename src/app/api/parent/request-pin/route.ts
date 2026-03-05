import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { generatePin, hashPin, pinExpiryDate } from '@/lib/parent-pin'
import { sendParentPinEmail } from '@/lib/email'

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const parentId = session.user.id

  // Rate limit: block if an unused PIN was created in the last 60 seconds
  const recentPin = await prisma.parentAccessPin.findFirst({
    where: {
      parentId,
      usedAt: null,
      expiresAt: { gt: new Date() },
      createdAt: { gt: new Date(Date.now() - 60 * 1000) },
    },
  })

  if (recentPin) {
    return NextResponse.json(
      { error: 'A PIN was already sent. Please wait 60 seconds before requesting another.' },
      { status: 429 }
    )
  }

  const parent = await prisma.parent.findUnique({
    where: { id: parentId },
    select: { email: true, name: true },
  })

  if (!parent) {
    return NextResponse.json({ error: 'Parent not found' }, { status: 404 })
  }

  const pin = generatePin()
  const pinHash = await hashPin(pin)
  const expiresAt = pinExpiryDate()

  await prisma.parentAccessPin.create({
    data: { parentId, pinHash, expiresAt },
  })

  const result = await sendParentPinEmail(parent.name ?? 'there', parent.email, pin)
  if (!result.success) {
    return NextResponse.json({ error: 'Failed to send PIN email' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
