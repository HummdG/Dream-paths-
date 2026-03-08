import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { trackEvent } from '@/lib/analytics'
import { sendWelcomeEmail } from '@/lib/email'
import { PLANS, getMaxChildren } from '@/lib/plans'
import { DASHBOARD_CACHE_TAG } from '@/lib/queries'

const onboardingSchema = z.object({
  parentName: z.string().min(1, 'Please enter your name'),
  childName: z.string().min(1, 'Please enter your child\'s name'),
  childAge: z.number().min(6).max(18, 'Age must be between 6 and 18'),
  pathId: z.string().min(1, 'Please select a path'),
  signupPlan: z.string().nullable().optional(),
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { parentName, childName, childAge, pathId: pathSlug, signupPlan } = onboardingSchema.parse(body)

    // Look up the path by slug to get the actual ID
    const path = await prisma.path.findUnique({
      where: { slug: pathSlug },
    })

    if (!path) {
      return NextResponse.json({ error: 'Selected path not found' }, { status: 400 })
    }

    // Upsert parent (create if doesn't exist from migration, update if exists)
    const parent = await prisma.parent.upsert({
      where: { id: session.user.id },
      update: { name: parentName },
      create: {
        id: session.user.id,
        email: session.user.email!,
        name: parentName,
      },
    })

    // Enforce child count limit based on subscription plan
    const subscription = await prisma.subscription.findUnique({
      where: { parentId: session.user.id },
      select: { planId: true },
    })
    const existingChildCount = await prisma.child.count({
      where: { parentId: session.user.id },
    })
    if (existingChildCount >= getMaxChildren(subscription?.planId)) {
      return NextResponse.json(
        { error: 'You have reached the maximum number of child profiles for your plan. Upgrade to add more.' },
        { status: 403 }
      )
    }

    // Create child with selected path
    const child = await prisma.child.create({
      data: {
        parentId: session.user.id,
        firstName: childName,
        age: childAge,
        pathId: path.id,
      },
    })

    // Create mission progress for all missions in the path
    const missions = await prisma.mission.findMany({
      where: { pathId: path.id },
      orderBy: { sequenceNumber: 'asc' },
    })

    // Create progress records - first mission is available, rest are locked
    await prisma.missionProgress.createMany({
      data: missions.map((mission, index) => ({
        childId: child.id,
        missionId: mission.id,
        status: index === 0 ? 'AVAILABLE' : 'LOCKED',
      })),
    })

    // Upsert free subscription
    await prisma.subscription.upsert({
      where: { parentId: session.user.id },
      update: {},
      create: {
        parentId: session.user.id,
        planId: PLANS.FREE,
        status: 'TRIALING',
      },
    })

    // Track events
    await trackEvent({
      eventName: 'child_created',
      parentId: session.user.id,
      childId: child.id,
      metadata: { age: childAge },
    })

    await trackEvent({
      eventName: 'path_selected',
      parentId: session.user.id,
      childId: child.id,
      metadata: { pathId: path.id, pathSlug },
    })

    // Send welcome email
    if (parent.email) {
      await sendWelcomeEmail(parent.email, parentName, childName, signupPlan ?? null)
    }

    revalidateTag(DASHBOARD_CACHE_TAG(session.user.id))

    return NextResponse.json({
      success: true,
      childId: child.id,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstIssue = error.issues[0]
      return NextResponse.json(
        { error: firstIssue?.message || 'Validation error' },
        { status: 400 }
      )
    }

    console.error('Onboarding error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

