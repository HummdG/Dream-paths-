/**
 * DEV ONLY: Unlock all missions for testing
 * 
 * Call this endpoint to bypass mission locks during development.
 * DELETE THIS FILE BEFORE PRODUCTION!
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';

export async function POST() {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the child for this parent
    const child = await prisma.child.findFirst({
      where: { parentId: session.user.id },
    });

    if (!child) {
      return NextResponse.json({ error: 'No child found' }, { status: 404 });
    }

    // Update all mission progress to AVAILABLE
    const result = await prisma.missionProgress.updateMany({
      where: {
        childId: child.id,
        status: 'LOCKED',
      },
      data: {
        status: 'AVAILABLE',
      },
    });

    console.log(`[DEV] Unlocked ${result.count} missions for child ${child.firstName}`);

    return NextResponse.json({
      success: true,
      unlockedCount: result.count,
      message: `Unlocked ${result.count} missions for ${child.firstName}!`,
    });
  } catch (error) {
    console.error('Error unlocking missions:', error);
    return NextResponse.json({ error: 'Failed to unlock missions' }, { status: 500 });
  }
}





