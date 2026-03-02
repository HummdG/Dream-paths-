import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { DashboardClient } from "./dashboard-client";
import { allMissionPacks, computeAllPackProgress } from "@/lib/missions";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const parent = await db.parent.findUnique({
    where: { id: session.user.id },
    include: {
      children: {
        include: {
          heroCharacter: true,
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
    },
  });

  if (!parent?.children?.length) {
    redirect("/onboarding");
  }

  const child = parent.children[0];
  const packsWithProgress = computeAllPackProgress(allMissionPacks, child.projects);

  return (
    <DashboardClient
      parentName={parent.name || "Parent"}
      childName={child.firstName}
      subscriptionPlan={parent.subscription?.planId || "free"}
      packsWithProgress={packsWithProgress}
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
