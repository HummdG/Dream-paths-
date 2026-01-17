import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(new URL('/login?error=missing-token', request.url))
    }

    // Find and validate token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    })

    if (!verificationToken) {
      return NextResponse.redirect(new URL('/login?error=invalid-token', request.url))
    }

    if (verificationToken.expires < new Date()) {
      // Delete expired token
      await prisma.verificationToken.delete({
        where: { token },
      })
      return NextResponse.redirect(new URL('/login?error=expired-token', request.url))
    }

    // Update user as verified
    await prisma.parent.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    })

    // Delete used token
    await prisma.verificationToken.delete({
      where: { token },
    })

    return NextResponse.redirect(new URL('/login?verified=true', request.url))
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.redirect(new URL('/login?error=verification-failed', request.url))
  }
}

