import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { DashboardClient } from "./dashboard-client";
import { ChildSelector } from "./child-selector";
import { allMissionPacks, computePathPackProgress } from "@/lib/missions";
import { PATH_PACKS } from "@/lib/plans";
import { DEV_EMAIL } from "@/lib/auth";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { childId?: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const allPackIds = allMissionPacks.map((p) => p.packId);

  const parent = await db.parent.findUnique({
    where: { id: session.user.id },
    include: {
      children: {
        include: {
          heroCharacter: true,
          projects: {
            where: { packId: { in: allPackIds } },
            include: { stepProgress: true },
          },
        },
      },
      subscription: true,
      pathSubscriptions: {
        where: { status: "ACTIVE" },
        select: { pathId: true },
      },
    },
  });

  if (!parent?.children?.length) {
    redirect("/onboarding");
  }

  // If there are multiple children and no childId selected, show the selector
  if (parent.children.length > 1 && !searchParams.childId) {
    const childCards = parent.children.map((c) => {
      const totalCompleted = c.projects.reduce(
        (sum, p) =>
          sum +
          p.stepProgress.filter((sp) => sp.status === "COMPLETED").length,
        0
      );
      const totalMissions = allMissionPacks.reduce(
        (sum, pack) => sum + pack.missions.length,
        0
      );
      return {
        childId: c.id,
        firstName: c.firstName,
        heroPixels: c.heroCharacter
          ? (c.heroCharacter.pixelData as string[][])
          : null,
        completedMissions: totalCompleted,
        totalMissions,
        totalStars: c.projects.reduce((sum, p) => sum + p.totalStars, 0),
      };
    });

    return (
      <ChildSelector
        parentName={parent.name || "Parent"}
        childCards={childCards}
      />
    );
  }

  const subscriptionPlan = parent.subscription?.planId ?? "free";
  const purchasedPathIds = parent.pathSubscriptions.map((ps) => ps.pathId);

  // Select child by ID if provided, otherwise use first child
  const child = searchParams.childId
    ? (parent.children.find((c) => c.id === searchParams.childId) ??
      parent.children[0])
    : parent.children[0];

  const isDev = session.user.email === DEV_EMAIL;

  const careerPathsProgress = Object.entries(PATH_PACKS).map(
    ([pathId, packIds]) => {
      const pathPacks = allMissionPacks.filter((p) => packIds.includes(p.packId));
      const packsProgress = computePathPackProgress(
        pathPacks,
        child.projects,
        subscriptionPlan,
        purchasedPathIds,
        { bypassProgressionLock: isDev }
      );
      return { pathId, packsProgress };
    }
  );

  return (
    <DashboardClient
      parentName={parent.name || "Parent"}
      childName={child.firstName}
      subscriptionPlan={subscriptionPlan}
      purchasedPathIds={purchasedPathIds}
      careerPathsProgress={careerPathsProgress}
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
