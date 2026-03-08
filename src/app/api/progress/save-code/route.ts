import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { verifyProjectOwnership } from "@/lib/queries";

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

    const project = await verifyProjectOwnership(projectId, session.user.email);

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
    await db.$executeRaw`
      DELETE FROM "CodeSnapshot"
      WHERE id IN (
        SELECT id FROM "CodeSnapshot"
        WHERE "projectId" = ${projectId} AND "stepId" = ${stepId}
        ORDER BY "createdAt" DESC
        OFFSET 20
      )
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving code:", error);
    return NextResponse.json(
      { error: "Failed to save code" },
      { status: 500 }
    );
  }
}






