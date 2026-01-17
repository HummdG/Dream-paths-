import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { trackEvent } from '@/lib/analytics'
import { sendWelcomeEmail } from '@/lib/email'

const onboardingSchema = z.object({
  parentName: z.string().min(1, 'Please enter your name'),
  childName: z.string().min(1, 'Please enter your child\'s name'),
  childAge: z.number().min(6).max(14, 'Age must be between 6 and 14'),
  pathId: z.string().min(1, 'Please select a path'),
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { parentName, childName, childAge, pathId: pathSlug } = onboardingSchema.parse(body)

    // Look up the path by slug to get the actual ID
    const path = await prisma.path.findUnique({
      where: { slug: pathSlug },
    })

    if (!path) {
      return NextResponse.json({ error: 'Selected path not found' }, { status: 400 })
    }

    // Update parent name
    const parent = await prisma.parent.update({
      where: { id: session.user.id },
      data: { name: parentName },
    })

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

    // Create free subscription
    await prisma.subscription.create({
      data: {
        parentId: session.user.id,
        planId: 'free',
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
      await sendWelcomeEmail(parent.email, parentName, childName)
    }

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

