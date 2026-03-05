import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { allMissionPacks, computePathPackProgress } from "@/lib/missions";
import { PATH_PACKS } from "@/lib/plans";
import { PathClient } from "./path-client";

interface PathPageProps {
  params: Promise<{ pathId: string }>;
}

export default async function PathPage({ params }: PathPageProps) {
  const { pathId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const packIds = PATH_PACKS[pathId];
  if (!packIds) {
    redirect("/dashboard");
  }

  const pathPacks = allMissionPacks.filter((p) => packIds.includes(p.packId));

  const parent = await db.parent.findUnique({
    where: { id: session.user.id },
    include: {
      children: {
        include: {
          heroCharacter: true,
          projects: {
            where: { packId: { in: packIds } },
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

  const child = parent.children[0];
  const subscriptionPlan = parent.subscription?.planId ?? "free";
  const purchasedPathIds = parent.pathSubscriptions.map((ps) => ps.pathId);
  const packsProgress = computePathPackProgress(
    pathPacks,
    child.projects,
    subscriptionPlan,
    purchasedPathIds
  );

  return (
    <PathClient
      pathId={pathId}
      packsProgress={packsProgress}
      heroPixels={
        child.heroCharacter
          ? (child.heroCharacter.pixelData as string[][])
          : null
      }
    />
  );
}
