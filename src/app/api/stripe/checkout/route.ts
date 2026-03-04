import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import { PLANS, type PlanId } from '@/lib/plans'

const PRICE_IDS: Record<string, string | undefined> = {
  [PLANS.FOUNDING_FAMILY]: process.env.STRIPE_FOUNDING_FAMILY_PRICE_ID,
  [PLANS.DREAM_STUDIO]: process.env.STRIPE_DREAM_STUDIO_PRICE_ID,
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planId } = (await request.json()) as { planId: PlanId }

    if (planId !== PLANS.FOUNDING_FAMILY && planId !== PLANS.DREAM_STUDIO) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const priceId = PRICE_IDS[planId]
    if (!priceId) {
      return NextResponse.json({ error: 'Price not configured for this plan' }, { status: 500 })
    }

    const parent = await prisma.parent.findUnique({
      where: { id: session.user.id },
      include: { subscription: true },
    })

    if (!parent) {
      return NextResponse.json({ error: 'Parent not found' }, { status: 404 })
    }

    // Reuse existing Stripe customer, or create one
    let stripeCustomerId = parent.subscription?.stripeCustomerId ?? null

    if (!stripeCustomerId) {
      const customer = await getStripe().customers.create({
        email: parent.email,
        name: parent.name ?? undefined,
        metadata: { parentId: parent.id },
      })
      stripeCustomerId = customer.id

      // Persist it immediately so a second click doesn't create a duplicate
      await prisma.subscription.update({
        where: { parentId: parent.id },
        data: { stripeCustomerId },
      })
    }

    const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

    const checkoutSession = await getStripe().checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/upgrade?success=true`,
      cancel_url: `${baseUrl}/upgrade`,
      metadata: { parentId: parent.id, planId },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
