import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { verifyProjectOwnership, DASHBOARD_CACHE_TAG } from "@/lib/queries";
import { revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, missionId, stepId, stars, badge } = body;

    if (!projectId || !missionId || !stepId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const project = await verifyProjectOwnership(projectId, session.user.email);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Upsert step progress
    const stepProgress = await db.stepProgress.upsert({
      where: {
        projectId_stepId: {
          projectId,
          stepId,
        },
      },
      create: {
        projectId,
        missionId,
        stepId,
        currentCode: "", // Will be updated separately
        status: "COMPLETED",
        starsEarned: stars || 0,
        completedAt: new Date(),
        startedAt: new Date(),
      },
      update: {
        status: "COMPLETED",
        starsEarned: stars || 0,
        completedAt: new Date(),
      },
    });

    // Update project total stars and badges
    const starsResult = await db.stepProgress.aggregate({
      where: { projectId },
      _sum: { starsEarned: true },
    });
    const totalStars = starsResult._sum.starsEarned ?? 0;

    // Get current badges and add new one if present
    const currentBadges = (project.badgesJson as string[]) || [];
    const newBadges = badge && !currentBadges.includes(badge)
      ? [...currentBadges, badge]
      : currentBadges;

    await db.project.update({
      where: { id: projectId },
      data: {
        totalStars,
        badgesJson: newBadges,
        currentStepId: stepId,
      },
    });

    revalidateTag(DASHBOARD_CACHE_TAG(session.user.id!));

    return NextResponse.json({
      success: true,
      stepProgress,
      totalStars,
      badges: newBadges,
    });
  } catch (error) {
    console.error("Error saving step progress:", error);
    return NextResponse.json(
      { error: "Failed to save progress" },
      { status: 500 }
    );
  }
}






