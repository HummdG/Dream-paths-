import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import type Stripe from 'stripe'

function deriveDbStatus(s: string): 'TRIALING' | 'ACTIVE' | 'CANCELED' | 'PAST_DUE' {
  if (s === 'trialing') return 'TRIALING'
  if (s === 'canceled') return 'CANCELED'
  if (s === 'past_due') return 'PAST_DUE'
  return 'ACTIVE'
}

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
        const type = checkoutSession.metadata?.type
        const pathId = checkoutSession.metadata?.pathId
        const stripeSubscriptionId = checkoutSession.subscription as string
        const stripeCustomerId = checkoutSession.customer as string

        if (!parentId || !type) {
          console.error('checkout.session.completed: missing metadata', checkoutSession.metadata)
          break
        }

        if (type === 'add_child') {
          const childFirstName = checkoutSession.metadata?.childFirstName
          const childAgeStr = checkoutSession.metadata?.childAge
          if (!childFirstName || !childAgeStr) {
            console.error('checkout.session.completed: missing child metadata', checkoutSession.metadata)
            break
          }
          await prisma.child.create({
            data: {
              parentId,
              firstName: childFirstName,
              age: parseInt(childAgeStr, 10),
            },
          })
        } else if (type === 'dream_studio') {
          await prisma.subscription.update({
            where: { parentId },
            data: {
              planId: 'dream_studio',
              status: 'ACTIVE',
              stripeCustomerId,
              stripeSubscriptionId,
            },
          })
        } else if (type === 'path' && pathId) {
          await prisma.$transaction([
            prisma.pathSubscription.upsert({
              where: { parentId_pathId: { parentId, pathId } },
              create: {
                parentId,
                pathId,
                status: 'ACTIVE',
                stripeSubscriptionId,
              },
              update: {
                status: 'ACTIVE',
                stripeSubscriptionId,
              },
            }),
            prisma.subscription.update({
              where: { parentId },
              data: { stripeCustomerId },
            }),
          ])
        } else {
          console.error('checkout.session.completed: unknown type or missing pathId', checkoutSession.metadata)
        }
        break
      }

      case 'customer.subscription.updated': {
        const stripeSub = event.data.object as Stripe.Subscription
        const dbStatus = deriveDbStatus(stripeSub.status)

        // Check PathSubscription first
        const pathSub = await prisma.pathSubscription.findUnique({
          where: { stripeSubscriptionId: stripeSub.id },
        })

        if (pathSub) {
          await prisma.pathSubscription.update({
            where: { stripeSubscriptionId: stripeSub.id },
            data: { status: dbStatus },
          })
          break
        }

        // Fall through to main Subscription
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
        if (priceId === process.env.STRIPE_DREAM_STUDIO_PRICE_ID) planId = 'dream_studio'

        await prisma.subscription.update({
          where: { stripeSubscriptionId: stripeSub.id },
          data: { planId, status: dbStatus },
        })
        break
      }

      case 'customer.subscription.deleted': {
        const stripeSub = event.data.object as Stripe.Subscription

        // Check PathSubscription first
        const pathSub = await prisma.pathSubscription.findUnique({
          where: { stripeSubscriptionId: stripeSub.id },
        })

        if (pathSub) {
          await prisma.pathSubscription.update({
            where: { stripeSubscriptionId: stripeSub.id },
            data: { status: 'CANCELED' },
          })
          break
        }

        // Fall through to main Subscription
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
