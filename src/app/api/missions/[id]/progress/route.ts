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

    // Get the child for this parent
    const child = await prisma.child.findFirst({
      where: { parentId: session.user.id },
    });

    if (!child) {
      return NextResponse.json({ error: "No child found" }, { status: 404 });
    }

    // Get the request body
    const body = await request.json();
    const { currentStep, codeProgress } = body;

    // Update the progress
    await prisma.missionProgress.update({
      where: {
        childId_missionId: {
          childId: child.id,
          missionId,
        },
      },
      data: {
        currentStep: currentStep ?? undefined,
        codeProgress: codeProgress ?? undefined,
      },
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


