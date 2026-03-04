import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import type Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const checkoutSession = event.data.object as Stripe.Checkout.Session
        if (checkoutSession.mode !== 'subscription') break

        const parentId = checkoutSession.metadata?.parentId
        const planId = checkoutSession.metadata?.planId
        const stripeSubscriptionId = checkoutSession.subscription as string
        const stripeCustomerId = checkoutSession.customer as string

        if (!parentId || !planId) {
          console.error('checkout.session.completed: missing metadata', checkoutSession.metadata)
          break
        }

        await prisma.subscription.update({
          where: { parentId },
          data: {
            planId,
            status: 'ACTIVE',
            stripeCustomerId,
            stripeSubscriptionId,
          },
        })
        break
      }

      case 'customer.subscription.updated': {
        const stripeSub = event.data.object as Stripe.Subscription

        const subscription = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: stripeSub.id },
        })

        if (!subscription) {
          console.error('customer.subscription.updated: subscription not found for', stripeSub.id)
          break
        }

        // Derive planId from price ID if we can match it; otherwise keep current
        const priceId = stripeSub.items.data[0]?.price.id
        let planId = subscription.planId
        if (priceId === process.env.STRIPE_FOUNDING_FAMILY_PRICE_ID) planId = 'founding_family'
        else if (priceId === process.env.STRIPE_DREAM_STUDIO_PRICE_ID) planId = 'dream_studio'

        const stripeStatus = stripeSub.status
        let dbStatus: 'TRIALING' | 'ACTIVE' | 'CANCELED' | 'PAST_DUE' = 'ACTIVE'
        if (stripeStatus === 'trialing') dbStatus = 'TRIALING'
        else if (stripeStatus === 'canceled') dbStatus = 'CANCELED'
        else if (stripeStatus === 'past_due') dbStatus = 'PAST_DUE'

        await prisma.subscription.update({
          where: { stripeSubscriptionId: stripeSub.id },
          data: { planId, status: dbStatus },
        })
        break
      }

      case 'customer.subscription.deleted': {
        const stripeSub = event.data.object as Stripe.Subscription

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: stripeSub.id },
          data: {
            status: 'CANCELED',
            planId: 'free',
          },
        })
        break
      }

      default:
        // Unhandled event type — ignore
        break
    }
  } catch (err) {
    console.error(`Error handling Stripe event ${event.type}:`, err)
    return NextResponse.json({ error: 'Webhook handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
