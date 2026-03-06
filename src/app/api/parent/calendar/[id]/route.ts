import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  startAt: z.string().datetime().optional(),
  endAt: z.string().datetime().nullable().optional(),
  isDreampaths: z.boolean().optional(),
  childId: z.string().nullable().optional(),
  packId: z.string().nullable().optional(),
  missionId: z.string().nullable().optional(),
  emailReminder: z.boolean().optional(),
});

async function getOwnedEvent(id: string, parentId: string) {
  return prisma.calendarEvent.findFirst({ where: { id, parentId } });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getOwnedEvent(id, session.user.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const data = parsed.data;

  // Verify child ownership if changing childId
  if (data.childId) {
    const child = await prisma.child.findFirst({
      where: { id: data.childId, parentId: session.user.id },
      select: { id: true },
    });
    if (!child) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }
  }

  const updated = await prisma.calendarEvent.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.startAt !== undefined && { startAt: new Date(data.startAt) }),
      ...(data.endAt !== undefined && { endAt: data.endAt ? new Date(data.endAt) : null }),
      ...(data.isDreampaths !== undefined && { isDreampaths: data.isDreampaths }),
      ...(data.childId !== undefined && { childId: data.childId }),
      ...(data.packId !== undefined && { packId: data.packId }),
      ...(data.missionId !== undefined && { missionId: data.missionId }),
      ...(data.emailReminder !== undefined && { emailReminder: data.emailReminder }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getOwnedEvent(id, session.user.id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.calendarEvent.delete({ where: { id } });

  return new NextResponse(null, { status: 204 });
}
