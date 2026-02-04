import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Validation schema for creating a game project
const createProjectSchema = z.object({
  childId: z.string(),
  name: z.string().min(1).max(50),
  heroId: z.string().optional(),
  levelIds: z.array(z.string()).optional(),
  spriteIds: z.array(z.string()).optional(),
  settings: z.record(z.unknown()).optional(),
});

// Update schema
const updateProjectSchema = createProjectSchema.partial().extend({
  id: z.string(),
});

// GET - List user's game projects
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const childId = searchParams.get("childId");

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

    // Get projects
    const projects = await prisma.gameProject.findMany({
      where: {
        childId: child.id,
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST - Create a new game project
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createProjectSchema.parse(body);

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

    // Create the project
    const project = await prisma.gameProject.create({
      data: {
        childId: child.id,
        name: validatedData.name,
        heroId: validatedData.heroId,
        levelIds: validatedData.levelIds || [],
        spriteIds: validatedData.spriteIds || [],
        settings: validatedData.settings || {},
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

// PUT - Update a game project
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = updateProjectSchema.parse(body);

    // Verify project belongs to user's child
    const existingProject = await prisma.gameProject.findFirst({
      where: {
        id: validatedData.id,
        child: {
          parentId: session.user.id,
        },
      },
    });

    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Update the project
    const project = await prisma.gameProject.update({
      where: { id: validatedData.id },
      data: {
        ...(validatedData.name && { name: validatedData.name }),
        ...(validatedData.heroId !== undefined && { heroId: validatedData.heroId }),
        ...(validatedData.levelIds && { levelIds: validatedData.levelIds }),
        ...(validatedData.spriteIds && { spriteIds: validatedData.spriteIds }),
        ...(validatedData.settings && { settings: validatedData.settings }),
      },
    });

    return NextResponse.json({ project });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a game project
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("id");

    if (!projectId) {
      return NextResponse.json({ error: "Project ID required" }, { status: 400 });
    }

    // Verify project belongs to user's child
    const project = await prisma.gameProject.findFirst({
      where: {
        id: projectId,
        child: {
          parentId: session.user.id,
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    await prisma.gameProject.delete({
      where: { id: projectId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}


