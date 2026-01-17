import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Get parent with child and mission progress
  const parent = await prisma.parent.findUnique({
    where: { id: session.user.id },
    include: {
      children: {
        include: {
          path: true,
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
    />
  );
}

