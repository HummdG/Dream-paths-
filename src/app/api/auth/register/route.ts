import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { sendVerificationEmail } from '@/lib/email'
import { trackEvent } from '@/lib/analytics'
import { checkRateLimit, getClientIp, rateLimitedResponse } from '@/lib/rate-limit'
import crypto from 'crypto'

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const rl = checkRateLimit(`register:${ip}`, 5, 60 * 60 * 1000); // 5 per IP per hour
  if (!rl.allowed) return rateLimitedResponse(rl.resetAt);

  try {
    const body = await request.json()
    const { email, password } = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.parent.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await hash(password, 12)

    // Create verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create user
    const parent = await prisma.parent.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
      },
    })

    // Store verification token
    await prisma.verificationToken.create({
      data: {
        identifier: email.toLowerCase(),
        token: verificationToken,
        expires: tokenExpiry,
      },
    })

    // Send verification email
    await sendVerificationEmail(email, verificationToken)

    // Track signup
    await trackEvent({
      eventName: 'parent_signup',
      parentId: parent.id,
    })

    return NextResponse.json({
      success: true,
      message: 'Please check your email to verify your account',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstIssue = error.issues[0]
      return NextResponse.json(
        { error: firstIssue?.message || 'Validation error' },
        { status: 400 }
      )
    }

    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

