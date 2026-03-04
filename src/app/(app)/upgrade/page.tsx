import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { UpgradeClient } from './upgrade-client'

export default async function UpgradePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  const session = await getServerSession(authOptions)
  const { success } = await searchParams
  const isSuccess = success === 'true'

  let planId = 'free'
  let hasStripeCustomer = false
  let purchasedPathIds: string[] = []

  if (session?.user?.id) {
    const [subscription, pathSubs] = await Promise.all([
      prisma.subscription.findUnique({
        where: { parentId: session.user.id },
        select: { planId: true, stripeCustomerId: true },
      }),
      prisma.pathSubscription.findMany({
        where: { parentId: session.user.id, status: 'ACTIVE' },
        select: { pathId: true },
      }),
    ])
    planId = subscription?.planId ?? 'free'
    hasStripeCustomer = Boolean(subscription?.stripeCustomerId)
    purchasedPathIds = pathSubs.map(ps => ps.pathId)
  }

  return (
    <UpgradeClient
      currentPlanId={planId}
      hasStripeCustomer={hasStripeCustomer}
      isSuccess={isSuccess}
      purchasedPathIds={purchasedPathIds}
    />
  )
}
