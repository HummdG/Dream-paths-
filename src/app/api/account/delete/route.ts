import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parentId = session.user.id;

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!body.password) {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }

  const parent = await prisma.parent.findUnique({
    where: { id: parentId },
    select: {
      passwordHash: true,
      subscription: {
        select: { stripeCustomerId: true, stripeSubscriptionId: true },
      },
      pathSubscriptions: {
        where: { status: "ACTIVE" },
        select: { stripeSubscriptionId: true },
      },
    },
  });

  if (!parent) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const passwordValid = await bcrypt.compare(body.password, parent.passwordHash);
  if (!passwordValid) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 403 });
  }

  // Cancel Stripe subscriptions before deleting the DB record
  const stripe = (() => {
    try {
      return getStripe();
    } catch {
      return null;
    }
  })();

  if (stripe) {
    const subIds: string[] = [];

    if (parent.subscription?.stripeSubscriptionId) {
      subIds.push(parent.subscription.stripeSubscriptionId);
    }
    for (const ps of parent.pathSubscriptions) {
      if (ps.stripeSubscriptionId) {
        subIds.push(ps.stripeSubscriptionId);
      }
    }

    for (const subId of subIds) {
      try {
        await stripe.subscriptions.cancel(subId);
      } catch {
        // Ignore already-cancelled or not-found errors
      }
    }
  }

  await prisma.parent.delete({ where: { id: parentId } });

  return NextResponse.json({ success: true });
}
