import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { allMissionPacks } from "@/lib/missions";
import { ParentDashboardClient } from "../parent-dashboard-client";
import type { ChildData, PackData, MissionData, StepData } from "@/components/parent-dashboard/child-progress-card";

const PACK_EMOJIS: Record<string, string> = {
  snake_basics_v1: "🐍",
  platformer_v1: "🎮",
};

export default async function ParentDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const parentId = session.user.id;

  const parent = await prisma.parent.findUnique({
    where: { id: parentId },
    select: {
      name: true,
      children: {
        select: {
          id: true,
          firstName: true,
          age: true,
          heroCharacter: {
            select: { pixelData: true },
          },
          projects: {
            select: {
              packId: true,
              totalStars: true,
              updatedAt: true,
              stepProgress: {
                select: {
                  missionId: true,
                  stepId: true,
                  status: true,
                  starsEarned: true,
                  runCount: true,
                  hintViews: true,
                  completedAt: true,
                },
                orderBy: { createdAt: "asc" },
              },
            },
          },
        },
      },
    },
  });

  if (!parent) {
    redirect("/login");
  }

  // Build serialisable ChildData[]
  const children: ChildData[] = parent.children.map((child) => {
    // Hero pixels
    let heroPixels: string[][] | null = null;
    if (child.heroCharacter?.pixelData) {
      heroPixels = child.heroCharacter.pixelData as string[][];
    }

    // Build per-pack data using the static mission pack definitions
    const packs: PackData[] = allMissionPacks.map((pack) => {
      const project = child.projects.find((p) => p.packId === pack.packId);

      // Index step progress by stepId for quick lookup
      const progressByStep = new Map(
        (project?.stepProgress ?? []).map((sp) => [sp.stepId, sp])
      );

      const missions: MissionData[] = pack.missions.map((mission) => {
        const steps: StepData[] = mission.steps.map((step) => {
          const sp = progressByStep.get(step.stepId);
          return {
            stepId: step.stepId,
            instruction: step.instruction,
            concepts: step.concepts,
            status: (sp?.status ?? "NOT_STARTED") as StepData["status"],
            starsEarned: sp?.starsEarned ?? 0,
            runCount: sp?.runCount ?? 0,
            hintViews: sp?.hintViews ?? 0,
            completedAt: sp?.completedAt ? sp.completedAt.toISOString() : null,
          };
        });
        return { missionId: mission.missionId, title: mission.title, steps };
      });

      const totalStars = project?.totalStars ?? 0;
      const lastActiveAt = project?.updatedAt ? project.updatedAt.toISOString() : null;

      return {
        packId: pack.packId,
        packTitle: pack.packTitle,
        emoji: PACK_EMOJIS[pack.packId] ?? "⭐",
        missions,
        totalStars,
        lastActiveAt,
      };
    });

    // Only include packs that have at least some activity
    const activePacks = packs.filter(
      (p) => p.totalStars > 0 || p.missions.some((m) => m.steps.some((s) => s.status !== "NOT_STARTED"))
    );

    const totalStars = child.projects.reduce((sum, p) => sum + p.totalStars, 0);

    return {
      childId: child.id,
      firstName: child.firstName,
      age: child.age,
      totalStars,
      heroPixels,
      packs: activePacks,
    };
  });

  return (
    <ParentDashboardClient
      parentName={parent.name ?? "Parent"}
      childrenData={children}
    />
  );
}
