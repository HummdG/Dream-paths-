import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { allMissionPacks, computeAllPackProgress } from "@/lib/missions";
import { GameClient } from "./game-client";

interface GamePageProps {
  params: Promise<{ packId: string }>;
}

export default async function GamePage({ params }: GamePageProps) {
  const { packId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const pack = allMissionPacks.find(p => p.packId === packId);
  if (!pack) {
    redirect("/dashboard");
  }

  const parent = await db.parent.findUnique({
    where: { id: session.user.id },
    include: {
      children: {
        include: {
          projects: {
            where: {
              packId: { in: allMissionPacks.map(p => p.packId) },
            },
            include: {
              stepProgress: true,
            },
          },
        },
      },
      subscription: true,
      pathSubscriptions: {
        where: { status: 'ACTIVE' },
        select: { pathId: true },
      },
    },
  });

  if (!parent?.children?.length) {
    redirect("/onboarding");
  }

  const child = parent.children[0];
  const subscriptionPlan = parent.subscription?.planId ?? 'free'
  const purchasedPathIds = parent.pathSubscriptions.map(ps => ps.pathId)
  const packsWithProgress = computeAllPackProgress(allMissionPacks, child.projects, subscriptionPlan, purchasedPathIds);
  const thisPackProgress = packsWithProgress.find(pp => pp.pack.packId === packId);

  // Redirect locked packs back to the dashboard
  if (thisPackProgress?.locked) {
    redirect("/dashboard");
  }

  const { completedMissionIds, totalStars, badges } = thisPackProgress ?? {
    completedMissionIds: [],
    totalStars: 0,
    badges: [],
  };

  return (
    <GameClient
      pack={pack}
      completedMissionIds={completedMissionIds}
      totalStars={totalStars}
      badges={badges}
    />
  );
}
