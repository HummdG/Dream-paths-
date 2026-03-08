import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { PLANS } from '@/lib/plans'

const addChildSchema = z.object({
  firstName: z.string().min(1, 'Please enter a name'),
  age: z.number().int().min(6).max(18, 'Age must be between 6 and 18'),
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { firstName, age } = addChildSchema.parse(body)

    // Only Dream Studio parents can add children directly (others use Stripe checkout)
    const subscription = await prisma.subscription.findUnique({
      where: { parentId: session.user.id },
      select: { planId: true },
    })

    if (subscription?.planId !== PLANS.DREAM_STUDIO) {
      return NextResponse.json(
        { error: 'Dream Studio subscription required to add children directly.' },
        { status: 403 }
      )
    }

    const child = await prisma.child.create({
      data: {
        parentId: session.user.id,
        firstName,
        age,
      },
    })

    return NextResponse.json({ success: true, childId: child.id })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstIssue = error.issues[0]
      return NextResponse.json(
        { error: firstIssue?.message || 'Validation error' },
        { status: 400 }
      )
    }
    console.error('Add child error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
