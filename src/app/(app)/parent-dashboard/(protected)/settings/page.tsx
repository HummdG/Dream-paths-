import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const parentId = session.user.id;

  const [parent, subscription, pathSubs] = await Promise.all([
    prisma.parent.findUnique({
      where: { id: parentId },
      select: { email: true, name: true },
    }),
    prisma.subscription.findUnique({
      where: { parentId },
      select: { planId: true, stripeCustomerId: true },
    }),
    prisma.pathSubscription.findMany({
      where: { parentId, status: "ACTIVE" },
      select: { pathId: true },
    }),
  ]);

  if (!parent) {
    redirect("/login");
  }

  return (
    <SettingsClient
      email={parent.email}
      name={parent.name ?? null}
      subscription={{
        planId: subscription?.planId ?? "free",
        hasStripeCustomer: Boolean(subscription?.stripeCustomerId),
        purchasedPathIds: pathSubs.map((ps) => ps.pathId),
      }}
    />
  );
}
