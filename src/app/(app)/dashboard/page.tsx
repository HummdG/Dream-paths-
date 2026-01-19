import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { DashboardClient } from "./dashboard-client";
import { platformerMissionPack } from "@/lib/missions";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Get parent with child and mission progress
  const parent = await db.parent.findUnique({
    where: { id: session.user.id },
    include: {
      children: {
        include: {
          path: true,
          heroCharacter: true,
          missionProgress: {
            include: {
              mission: true,
            },
            orderBy: {
              mission: {
                sequenceNumber: "asc",
              },
            },
          },
          projects: {
            where: {
              packId: platformerMissionPack.packId,
            },
            include: {
              stepProgress: true,
            },
          },
        },
      },
      subscription: true,
    },
  });

  // If no child, redirect to onboarding
  if (!parent?.children?.length) {
    redirect("/onboarding");
  }

  const child = parent.children[0];
  const missions = child.missionProgress;

  const completedMissions = missions.filter((m) => m.status === "COMPLETED").length;
  const totalMissions = missions.length;

  // Get next available mission
  const nextMission = missions.find((m) => m.status === "AVAILABLE");

  // Get last completed mission
  const lastCompleted = missions
    .filter((m) => m.status === "COMPLETED" && m.completedAt)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())[0];

  // Get coding project data
  const codingProject = child.projects[0];
  const completedCodingMissionIds: string[] = [];
  
  if (codingProject) {
    // Group completed steps by mission
    const completedSteps = codingProject.stepProgress.filter(
      (sp) => sp.status === "COMPLETED"
    );
    
    // Check which missions have all steps completed
    for (const mission of platformerMissionPack.missions) {
      const missionStepIds = mission.steps.map((s) => s.stepId);
      const completedStepIds = completedSteps
        .filter((sp) => sp.missionId === mission.missionId)
        .map((sp) => sp.stepId);
      
      if (missionStepIds.every((id) => completedStepIds.includes(id))) {
        completedCodingMissionIds.push(mission.missionId);
      }
    }
  }

  return (
    <DashboardClient
      parentName={parent.name || "Parent"}
      childName={child.firstName}
      childAge={child.age}
      pathName={child.path?.name || "Junior Game Developer"}
      completedMissions={completedMissions}
      totalMissions={totalMissions}
      missions={missions.map((mp) => ({
        id: mp.mission.id,
        sequenceNumber: mp.mission.sequenceNumber,
        title: mp.mission.title,
        storyIntro: mp.mission.storyIntro,
        estimatedDuration: mp.mission.estimatedDurationMinutes,
        status: mp.status,
        completedAt: mp.completedAt?.toISOString() || null,
      }))}
      nextMission={
        nextMission
          ? {
              id: nextMission.mission.id,
              sequenceNumber: nextMission.mission.sequenceNumber,
              title: nextMission.mission.title,
              storyIntro: nextMission.mission.storyIntro,
              estimatedDuration: nextMission.mission.estimatedDurationMinutes,
            }
          : null
      }
      lastCompleted={
        lastCompleted
          ? {
              title: lastCompleted.mission.title,
              completedAt: lastCompleted.completedAt!.toISOString(),
            }
          : null
      }
      subscriptionPlan={parent.subscription?.planId || "free"}
      codingMissions={{
        completedMissionIds: completedCodingMissionIds,
        totalStars: codingProject?.totalStars || 0,
        badges: (codingProject?.badgesJson as string[]) || [],
      }}
      heroCharacter={
        child.heroCharacter
          ? {
              name: child.heroCharacter.name,
              pixels: child.heroCharacter.pixelData as string[][],
            }
          : null
      }
    />
  );
}

