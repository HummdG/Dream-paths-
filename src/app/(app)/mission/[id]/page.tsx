import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { MissionClient } from "./mission-client";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MissionPage({ params }: Props) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Get the child for this parent
  const child = await prisma.child.findFirst({
    where: { parentId: session.user.id },
  });

  if (!child) {
    redirect("/onboarding");
  }

  // Get mission and progress
  const mission = await prisma.mission.findUnique({
    where: { id },
    include: {
      path: true,
    },
  });

  if (!mission) {
    notFound();
  }

  const progress = await prisma.missionProgress.findUnique({
    where: {
      childId_missionId: {
        childId: child.id,
        missionId: id,
      },
    },
  });

  // Check if mission is accessible
  if (!progress || progress.status === "LOCKED") {
    redirect("/dashboard");
  }

  const steps = mission.stepsJson as string[];
  const resources = mission.resourcesJson as string[] | null;

  return (
    <MissionClient
      missionId={mission.id}
      sequenceNumber={mission.sequenceNumber}
      title={mission.title}
      storyIntro={mission.storyIntro}
      goal={mission.goal}
      steps={steps}
      estimatedDuration={mission.estimatedDurationMinutes}
      resources={resources}
      isCompleted={progress.status === "COMPLETED"}
      childName={child.firstName}
    />
  );
}

