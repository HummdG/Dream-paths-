import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/db'

/**
 * Bootstrap endpoint — creates the first admin account.
 * Only works when zero admin accounts exist. Disable or delete after first use.
 */
export async function POST(req: NextRequest) {
  const existingCount = await prisma.admin.count()
  if (existingCount > 0) {
    return NextResponse.json({ error: 'Setup already complete.' }, { status: 403 })
  }

  const { email, password, name } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  }
  if (password.length < 12) {
    return NextResponse.json({ error: 'Password must be at least 12 characters.' }, { status: 400 })
  }

  const passwordHash = await hash(password, 12)
  const admin = await prisma.admin.create({
    data: { email: email.toLowerCase(), passwordHash, name: name ?? null },
  })

  return NextResponse.json({ success: true, adminId: admin.id })
}
