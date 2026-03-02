import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { PlayClient } from "./play-client";
import { getMissionFromAnyPack } from "@/lib/missions";
import type { LevelData } from "@/components/level-designer/level-designer";

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

  // Resolve mission from any pack
  const packResult = getMissionFromAnyPack(missionId);

  if (!packResult) {
    redirect("/dashboard");
  }

  const { pack, mission } = packResult;

  // Get or create project for this child and pack
  let project = await db.project.findUnique({
    where: {
      childId_packId: {
        childId: child.id,
        packId: pack.packId,
      },
    },
    include: {
      stepProgress: true,
    },
  });

  if (!project) {
    // Create new project with default config
    project = await (db.project.create({
      data: {
        childId: child.id,
        packId: pack.packId,
        name: pack.packId === 'snake_basics_v1' ? "My Snake Game" : "My Platformer Game",
        currentMissionId: missionId,
        currentStepId: mission.steps[0].stepId,
        gameConfigJson: pack.gameTemplate.defaultConfig as object,
        badgesJson: [],
      },
      include: {
        stepProgress: true,
      },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any);
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

  if (!project) redirect("/");

  // Get completed steps for this mission
  const completedStepIds = project.stepProgress
    .filter(sp => sp.missionId === missionId && sp.status === "COMPLETED")
    .map(sp => sp.stepId);

  // Build a map of saved code per step so the user can resume where they left off
  const savedCodes: Record<string, string> = {};
  for (const sp of project.stepProgress) {
    if (sp.missionId === missionId && sp.currentCode) {
      savedCodes[sp.stepId] = sp.currentCode;
    }
  }

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

  // Get the user's most recent level for game preview (platformer missions only)
  let levelData: LevelData | undefined;
  if (mission.engineType !== 'snake') {
    const userLevel = await db.userLevel.findFirst({
      where: { childId: child.id },
      orderBy: { updatedAt: "desc" },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    levelData = userLevel ? (userLevel as unknown as any) as LevelData : undefined;
  }

  return (
    <PlayClient
      mission={mission}
      packId={pack.packId}
      childId={child.id}
      childName={child.firstName}
      projectId={project.id}
      completedStepIds={completedStepIds}
      savedCodes={savedCodes}
      initialStepIndex={currentStepIndex}
      heroPixels={heroPixels}
      levelData={levelData}
    />
  );
}
