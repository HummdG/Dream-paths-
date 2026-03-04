import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { trackEvent } from '@/lib/analytics'
import { sendNewMissionEmail } from '@/lib/email'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: missionId } = await params

    // Get child for this parent
    const child = await prisma.child.findFirst({
      where: { parentId: session.user.id },
      include: { path: true },
    })

    if (!child) {
      return NextResponse.json({ error: 'No child found' }, { status: 404 })
    }

    // Get the mission and progress
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
    })

    if (!mission) {
      return NextResponse.json({ error: 'Mission not found' }, { status: 404 })
    }

    const progress = await prisma.missionProgress.findUnique({
      where: {
        childId_missionId: {
          childId: child.id,
          missionId,
        },
      },
    })

    if (!progress || progress.status !== 'AVAILABLE') {
      return NextResponse.json(
        { error: 'Mission is not available' },
        { status: 400 }
      )
    }

    // Mark mission as completed
    await prisma.missionProgress.update({
      where: { id: progress.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    })

    // Track completion
    await trackEvent({
      eventName: 'mission_completed',
      parentId: session.user.id,
      childId: child.id,
      metadata: {
        missionId,
        sequenceNumber: mission.sequenceNumber,
      },
    })

    // Unlock next mission unconditionally (access is gated at pack level, not mission count)
    const nextMission = await prisma.mission.findFirst({
      where: {
        pathId: mission.pathId,
        sequenceNumber: mission.sequenceNumber + 1,
      },
    })

    if (nextMission) {
      await prisma.missionProgress.update({
        where: {
          childId_missionId: {
            childId: child.id,
            missionId: nextMission.id,
          },
        },
        data: { status: 'AVAILABLE' },
      })

      // Send email about new mission
      const parent = await prisma.parent.findUnique({
        where: { id: session.user.id },
      })

      if (parent?.email && parent.name) {
        await sendNewMissionEmail(
          parent.email,
          parent.name,
          child.firstName,
          nextMission.title
        )
      }
    }

    return NextResponse.json({
      success: true,
      completedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Mission completion error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
