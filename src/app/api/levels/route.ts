import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Validation schema for creating a level
const createLevelSchema = z.object({
  childId: z.string(),
  name: z.string().min(1).max(50),
  theme: z.string(),
  gridData: z.any(), // 2D array of tile data
  objects: z.array(z.object({
    id: z.string(),
    type: z.string(),
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    subtype: z.string().optional(),
    data: z.record(z.unknown()).optional(),
  })),
  settings: z.object({
    winCondition: z.enum(["reach_goal", "collect_all_coins", "defeat_all_enemies"]),
    requiredCoins: z.number().optional(),
    timeLimit: z.number().optional(),
  }),
  thumbnail: z.string().optional(),
});

// Update schema
const updateLevelSchema = createLevelSchema.partial().extend({
  id: z.string(),
});

// GET - List user's levels
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const childId = searchParams.get("childId");
    const theme = searchParams.get("theme");

    // Verify child belongs to parent
    const child = await prisma.child.findFirst({
      where: {
        id: childId || undefined,
        parentId: session.user.id,
      },
    });

    if (!child) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }

    // Get levels with optional theme filter
    const levels = await prisma.userLevel.findMany({
      where: {
        childId: child.id,
        ...(theme ? { theme } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ levels });
  } catch (error) {
    console.error("Error fetching levels:", error);
    return NextResponse.json(
      { error: "Failed to fetch levels" },
      { status: 500 }
    );
  }
}

// POST - Create a new level
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createLevelSchema.parse(body);

    // Verify child belongs to parent
    const child = await prisma.child.findFirst({
      where: {
        id: validatedData.childId,
        parentId: session.user.id,
      },
    });

    if (!child) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }

    // Create the level
    const level = await prisma.userLevel.create({
      data: {
        childId: child.id,
        name: validatedData.name,
        theme: validatedData.theme,
        gridData: validatedData.gridData || {},
        objects: validatedData.objects,
        settings: validatedData.settings,
        thumbnail: validatedData.thumbnail,
      },
    });

    return NextResponse.json({ level }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating level:", error);
    return NextResponse.json(
      { error: "Failed to create level" },
      { status: 500 }
    );
  }
}

// PUT - Update a level
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateLevelSchema.parse(body);

    // Verify level belongs to user's child
    const existingLevel = await prisma.userLevel.findFirst({
      where: {
        id: validatedData.id,
        child: {
          parentId: session.user.id,
        },
      },
    });

    if (!existingLevel) {
      return NextResponse.json({ error: "Level not found" }, { status: 404 });
    }

    // Update the level
    const level = await prisma.userLevel.update({
      where: { id: validatedData.id },
      data: {
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.theme && { theme: validatedData.theme }),
        ...(validatedData.gridData && { gridData: validatedData.gridData }),
        ...(validatedData.objects && { objects: validatedData.objects }),
        ...(validatedData.settings && { settings: validatedData.settings }),
        ...(validatedData.thumbnail !== undefined && { thumbnail: validatedData.thumbnail }),
      },
    });

    return NextResponse.json({ level });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating level:", error);
    return NextResponse.json(
      { error: "Failed to update level" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a level
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const levelId = searchParams.get("id");

    if (!levelId) {
      return NextResponse.json({ error: "Level ID required" }, { status: 400 });
    }

    // Verify level belongs to user's child
    const level = await prisma.userLevel.findFirst({
      where: {
        id: levelId,
        child: {
          parentId: session.user.id,
        },
      },
    });

    if (!level) {
      return NextResponse.json({ error: "Level not found" }, { status: 404 });
    }

    await prisma.userLevel.delete({
      where: { id: levelId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting level:", error);
    return NextResponse.json(
      { error: "Failed to delete level" },
      { status: 500 }
    );
  }
}


