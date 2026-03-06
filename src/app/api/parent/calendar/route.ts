import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startAt: z.string().datetime(),
  endAt: z.string().datetime().optional(),
  isDreampaths: z.boolean().default(false),
  childId: z.string().optional(),
  packId: z.string().optional(),
  missionId: z.string().optional(),
  emailReminder: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const year = parseInt(searchParams.get("year") ?? "");
  const month = parseInt(searchParams.get("month") ?? ""); // 1-based

  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
    return NextResponse.json({ error: "year and month (1-12) are required" }, { status: 400 });
  }

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1); // first day of next month

  const events = await prisma.calendarEvent.findMany({
    where: {
      parentId: session.user.id,
      startAt: { gte: start, lt: end },
    },
    orderBy: { startAt: "asc" },
  });

  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const data = parsed.data;

  // If a childId is provided, verify it belongs to this parent
  if (data.childId) {
    const child = await prisma.child.findFirst({
      where: { id: data.childId, parentId: session.user.id },
      select: { id: true },
    });
    if (!child) {
      return NextResponse.json({ error: "Child not found" }, { status: 404 });
    }
  }

  const event = await prisma.calendarEvent.create({
    data: {
      parentId: session.user.id,
      childId: data.childId ?? null,
      title: data.title,
      description: data.description ?? null,
      startAt: new Date(data.startAt),
      endAt: data.endAt ? new Date(data.endAt) : null,
      isDreampaths: data.isDreampaths,
      packId: data.packId ?? null,
      missionId: data.missionId ?? null,
      emailReminder: data.emailReminder,
    },
  });

  return NextResponse.json(event, { status: 201 });
}
