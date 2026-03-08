import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getMissionById, platformerMissionPack } from "@/lib/missions";
import { verifyProjectOwnership, DASHBOARD_CACHE_TAG } from "@/lib/queries";
import { revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, missionId } = body;

    if (!projectId || !missionId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const project = await verifyProjectOwnership(projectId, session.user.email);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Find the next mission
    const mission = getMissionById(missionId);
    if (!mission) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 });
    }

    const missionIndex = platformerMissionPack.missions.findIndex(
      (m) => m.missionId === missionId
    );
    
    const nextMission = platformerMissionPack.missions[missionIndex + 1];

    // Update project with next mission
    await db.project.update({
      where: { id: projectId },
      data: {
        currentMissionId: nextMission?.missionId || missionId,
        currentStepId: nextMission?.steps[0]?.stepId || mission.steps[0].stepId,
      },
    });

    // Also update the legacy MissionProgress if it exists
    const dbMission = await db.mission.findFirst({
      where: {
        title: { contains: mission.title.split(":")[1]?.trim() || mission.title },
      },
    });

    if (dbMission) {
      await db.missionProgress.upsert({
        where: {
          childId_missionId: {
            childId: project.childId,
            missionId: dbMission.id,
          },
        },
        create: {
          childId: project.childId,
          missionId: dbMission.id,
          status: "COMPLETED",
          completedAt: new Date(),
        },
        update: {
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });
    }

    revalidateTag(DASHBOARD_CACHE_TAG(session.user.id!), 'default');

    return NextResponse.json({
      success: true,
      nextMissionId: nextMission?.missionId || null,
      hasMoreMissions: !!nextMission,
    });
  } catch (error) {
    console.error("Error completing mission:", error);
    return NextResponse.json(
      { error: "Failed to complete mission" },
      { status: 500 }
    );
  }
}






