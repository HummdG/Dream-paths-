import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CodeJourneyClient } from "./code-journey-client";

interface PageProps {
  params: { levelId: string };
}

export default async function CodeJourneyPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Get parent and child
  const parent = await prisma.parent.findUnique({
    where: { id: session.user.id },
    include: {
      children: {
        include: {
          heroCharacter: true,
        },
      },
    },
  });

  if (!parent?.children.length) {
    redirect("/onboarding");
  }

  const child = parent.children[0];

  // Get the level
  const level = await prisma.userLevel.findUnique({
    where: { id: params.levelId },
  });

  if (!level || level.childId !== child.id) {
    redirect("/dashboard");
  }

  // Get existing progress (if any)
  const progress = await prisma.project.findFirst({
    where: {
      childId: child.id,
      packId: `level_${level.id}`,
    },
    include: {
      stepProgress: true,
    },
  });

  // Parse level data
  const levelData = {
    name: level.name,
    theme: level.theme as "space" | "jungle" | "city",
    objects: level.objects as Array<{
      id: string;
      type: "platform" | "coin" | "enemy" | "spawn" | "goal" | "decoration";
      x: number;
      y: number;
      width: number;
      height: number;
      subtype?: string;
    }>,
    settings: level.settings as {
      winCondition: "reach_goal" | "collect_all_coins" | "defeat_all_enemies";
      requiredCoins?: number;
      timeLimit?: number;
    },
  };

  // Parse hero pixels
  const heroPixels = child.heroCharacter?.pixelData as string[][] | undefined;

  // Build initial progress
  const initialProgress = progress
    ? {
        completedSteps: progress.stepProgress
          .filter((sp) => sp.status === "COMPLETED")
          .map((sp) => sp.stepId),
        totalXp: progress.totalStars * 10, // Convert stars to XP approximation
        streak: 1, // Would come from a streak tracker
        badges: (progress.badgesJson as string[]) || [],
        lastActiveDate: progress.updatedAt.toISOString(),
      }
    : undefined;

  return (
    <CodeJourneyClient
      levelData={levelData}
      childName={child.firstName}
      heroName={child.heroCharacter?.name || "Hero"}
      heroPixels={heroPixels}
      initialProgress={initialProgress}
      levelId={level.id}
    />
  );
}



