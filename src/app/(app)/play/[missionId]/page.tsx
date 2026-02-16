import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { PlayClient } from "./play-client";
import { platformerMissionPack, getMissionById } from "@/lib/missions";

interface PlayPageProps {
  params: Promise<{
    missionId: string;
  }>;
}

export default async function PlayPage({ params }: PlayPageProps) {
  const { missionId } = await params;
  
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/login");
  }

  // Get parent and child with hero character
  const parent = await db.parent.findUnique({
    where: { email: session.user.email },
    include: {
      children: {
        take: 1,
        orderBy: { createdAt: "asc" },
        include: {
          heroCharacter: true,
        },
      },
    },
  });

  if (!parent || parent.children.length === 0) {
    redirect("/onboarding");
  }

  const child = parent.children[0];

  // Get the mission from the pack
  const mission = getMissionById(missionId);
  
  if (!mission) {
    redirect("/dashboard");
  }

  // Get or create project for this child and pack
  let project = await db.project.findUnique({
    where: {
      childId_packId: {
        childId: child.id,
        packId: platformerMissionPack.packId,
      },
    },
    include: {
      stepProgress: true,
    },
  });

  if (!project) {
    // Create new project with default config
    project = await db.project.create({
      data: {
        childId: child.id,
        packId: platformerMissionPack.packId,
        name: "My Platformer Game",
        currentMissionId: missionId,
        currentStepId: mission.steps[0].stepId,
        gameConfigJson: platformerMissionPack.gameTemplate.defaultConfig,
        badgesJson: [],
      },
      include: {
        stepProgress: true,
      },
    });
  } else {
    // Update current mission if needed
    if (project.currentMissionId !== missionId) {
      await db.project.update({
        where: { id: project.id },
        data: {
          currentMissionId: missionId,
          currentStepId: mission.steps[0].stepId,
        },
      });
    }
  }

  // Get completed steps for this mission
  const completedStepIds = project.stepProgress
    .filter(sp => sp.missionId === missionId && sp.status === "COMPLETED")
    .map(sp => sp.stepId);

  // Find the current step index (first non-completed step)
  let currentStepIndex = 0;
  for (let i = 0; i < mission.steps.length; i++) {
    if (!completedStepIds.includes(mission.steps[i].stepId)) {
      currentStepIndex = i;
      break;
    }
    // If all are completed, stay on last step
    if (i === mission.steps.length - 1) {
      currentStepIndex = i;
    }
  }

  // Get hero pixels if available
  const heroPixels = child.heroCharacter?.pixelData as string[][] | undefined;

  // Get the user's most recent level for game preview
  const userLevel = await db.userLevel.findFirst({
    where: { childId: child.id },
    orderBy: { updatedAt: "desc" },
  });

  // Parse level data if available
  const levelData = userLevel ? {
    name: userLevel.name,
    theme: userLevel.theme as "space" | "jungle" | "city",
    objects: userLevel.objects as Array<{
      id: string;
      type: "platform" | "coin" | "enemy" | "spawn" | "goal" | "decoration";
      x: number;
      y: number;
      width: number;
      height: number;
      subtype?: string;
    }>,
    settings: userLevel.settings as {
      winCondition: "reach_goal" | "collect_all_coins" | "defeat_all_enemies";
      requiredCoins?: number;
      timeLimit?: number;
    },
  } : undefined;

  return (
    <PlayClient
      mission={mission}
      childId={child.id}
      childName={child.firstName}
      projectId={project.id}
      completedStepIds={completedStepIds}
      initialStepIndex={currentStepIndex}
      heroPixels={heroPixels}
      levelData={levelData}
    />
  );
}

