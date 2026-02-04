import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

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

    // Verify the project belongs to this user's child
    const parent = await db.parent.findUnique({
      where: { email: session.user.email },
      include: {
        children: {
          include: {
            projects: {
              where: { id: projectId },
            },
          },
        },
      },
    });

    const project = parent?.children
      .flatMap((c) => c.projects)
      .find((p) => p.id === projectId);

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
    const allStepProgress = await db.stepProgress.findMany({
      where: { projectId },
    });

    const totalStars = allStepProgress.reduce(
      (sum, sp) => sum + sp.starsEarned,
      0
    );

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


