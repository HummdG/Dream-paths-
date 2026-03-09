import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

interface Props {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: Props) {
  try {
    const { id: missionId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the request body
    const body = await request.json();
    const { currentStep, codeProgress } = body;

    // Scope the lookup to missionId + parent's children to prevent IDOR:
    // a parent with multiple children cannot manipulate the wrong child's progress.
    const progress = await prisma.missionProgress.findFirst({
      where: {
        missionId,
        child: { parentId: session.user.id },
      },
    });

    if (!progress) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 });
    }

    // Update the progress
    await prisma.missionProgress.update({
      where: {
        childId_missionId: {
          childId: progress.childId,
          missionId,
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        currentStep: currentStep ?? undefined,
        codeProgress: codeProgress ?? undefined,
      } as any,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving progress:", error);
    return NextResponse.json(
      { error: "Failed to save progress" },
      { status: 500 }
    );
  }
}






