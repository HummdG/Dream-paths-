import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { allMissionPacks, computePathPackProgress } from "@/lib/missions";
import { PATH_PACKS } from "@/lib/plans";
import { DEV_EMAIL } from "@/lib/auth";
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

  // Scope progress to this pack's path so progression locking doesn't bleed across paths.
  // e.g. rocket_basics_v1 must not be locked because platformer_v1 is incomplete.
  const pathId = Object.entries(PATH_PACKS).find(([, ids]) => ids.includes(packId))?.[0];
  const scopedPacks = pathId
    ? allMissionPacks.filter(p => PATH_PACKS[pathId].includes(p.packId))
    : allMissionPacks;

  const isDev = session.user.email === DEV_EMAIL;
  const packsWithProgress = computePathPackProgress(scopedPacks, child.projects, subscriptionPlan, purchasedPathIds, { bypassProgressionLock: isDev });
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
