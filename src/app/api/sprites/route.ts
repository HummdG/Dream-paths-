import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Validation schema for creating a sprite
const createSpriteSchema = z.object({
  childId: z.string(),
  name: z.string().min(1).max(50),
  type: z.enum(["OBSTACLE", "ENEMY", "ITEM", "DECORATION"]),
  pixelData: z.array(z.array(z.string())),
  behavior: z.object({
    type: z.enum(["patrol", "chase", "jump", "fly", "stationary"]),
    speed: z.number().min(1).max(10),
    range: z.number().min(1).max(20),
    jumpHeight: z.number().optional(),
  }).optional(),
});

// GET - List user's sprites
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const childId = searchParams.get("childId");
    const type = searchParams.get("type");

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

    // Get sprites with optional type filter
    const sprites = await prisma.userSprite.findMany({
      where: {
        childId: child.id,
        ...(type ? { type: type as "OBSTACLE" | "ENEMY" | "ITEM" | "DECORATION" } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ sprites });
  } catch (error) {
    console.error("Error fetching sprites:", error);
    return NextResponse.json(
      { error: "Failed to fetch sprites" },
      { status: 500 }
    );
  }
}

// POST - Create a new sprite
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createSpriteSchema.parse(body);

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

    // Create the sprite
    const sprite = await prisma.userSprite.create({
      data: {
        childId: child.id,
        name: validatedData.name,
        type: validatedData.type,
        pixelData: validatedData.pixelData as object,
        behavior: (validatedData.behavior || undefined) as object | undefined,
      },
    });

    return NextResponse.json({ sprite }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error creating sprite:", error);
    return NextResponse.json(
      { error: "Failed to create sprite" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a sprite
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const spriteId = searchParams.get("id");

    if (!spriteId) {
      return NextResponse.json({ error: "Sprite ID required" }, { status: 400 });
    }

    // Verify sprite belongs to user's child
    const sprite = await prisma.userSprite.findFirst({
      where: {
        id: spriteId,
        child: {
          parentId: session.user.id,
        },
      },
    });

    if (!sprite) {
      return NextResponse.json({ error: "Sprite not found" }, { status: 404 });
    }

    await prisma.userSprite.delete({
      where: { id: spriteId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting sprite:", error);
    return NextResponse.json(
      { error: "Failed to delete sprite" },
      { status: 500 }
    );
  }
}






