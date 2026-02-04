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
    const { projectId, missionId, stepId, code, triggerType = "AUTO_SAVE" } = body;

    if (!projectId || !stepId || code === undefined) {
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

    // Upsert step progress with current code
    await db.stepProgress.upsert({
      where: {
        projectId_stepId: {
          projectId,
          stepId,
        },
      },
      create: {
        projectId,
        missionId: missionId || project.currentMissionId,
        stepId,
        currentCode: code,
        status: "IN_PROGRESS",
        startedAt: new Date(),
      },
      update: {
        currentCode: code,
        status: "IN_PROGRESS",
      },
    });

    // Create a snapshot for version history
    await db.codeSnapshot.create({
      data: {
        projectId,
        stepId,
        code,
        triggerType: triggerType as "AUTO_SAVE" | "MANUAL_SAVE" | "RUN_CODE" | "STEP_COMPLETE" | "STEP_START",
      },
    });

    // Clean up old snapshots (keep only last 20 per step)
    const snapshots = await db.codeSnapshot.findMany({
      where: { projectId, stepId },
      orderBy: { createdAt: "desc" },
      skip: 20,
    });

    if (snapshots.length > 0) {
      await db.codeSnapshot.deleteMany({
        where: {
          id: { in: snapshots.map((s) => s.id) },
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving code:", error);
    return NextResponse.json(
      { error: "Failed to save code" },
      { status: 500 }
    );
  }
}


