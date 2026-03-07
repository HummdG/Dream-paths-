import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import { PATH_PACKS } from '@/lib/plans'

type CheckoutBody =
  | { type: 'path'; pathId: string }
  | { type: 'dream_studio' }
  | { type: 'add_child'; childFirstName: string; childAge: number }

function resolvePriceId(body: CheckoutBody): string | null {
  if (body.type === 'dream_studio') {
    return process.env.STRIPE_DREAM_STUDIO_PRICE_ID ?? null
  }
  if (body.type === 'add_child') {
    return process.env.STRIPE_ADD_CHILD_PRICE_ID ?? null
  }
  // Validate pathId is a known path
  if (!(body.pathId in PATH_PACKS)) return null
  const envKey = `STRIPE_PATH_${body.pathId.toUpperCase()}_PRICE_ID`
  return process.env[envKey] ?? null
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as CheckoutBody

    if (body.type !== 'path' && body.type !== 'dream_studio' && body.type !== 'add_child') {
      return NextResponse.json({ error: 'Invalid checkout type' }, { status: 400 })
    }

    if (body.type === 'path' && !body.pathId) {
      return NextResponse.json({ error: 'pathId is required for path checkout' }, { status: 400 })
    }

    if (body.type === 'path' && !(body.pathId in PATH_PACKS)) {
      return NextResponse.json({ error: 'Unknown pathId' }, { status: 400 })
    }

    if (body.type === 'add_child' && (!body.childFirstName || !body.childAge)) {
      return NextResponse.json({ error: 'childFirstName and childAge are required for add_child checkout' }, { status: 400 })
    }

    const priceId = resolvePriceId(body)
    if (!priceId) {
      return NextResponse.json({ error: 'Price not configured for this option' }, { status: 500 })
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
      success_url: body.type === 'add_child'
        ? `${baseUrl}/parent-dashboard?child_added=true`
        : `${baseUrl}/upgrade?success=true`,
      cancel_url: body.type === 'add_child'
        ? `${baseUrl}/parent-dashboard`
        : `${baseUrl}/upgrade`,
      metadata: {
        parentId: parent.id,
        type: body.type,
        pathId: body.type === 'path' ? body.pathId : '',
        childFirstName: body.type === 'add_child' ? body.childFirstName : '',
        childAge: body.type === 'add_child' ? String(body.childAge) : '',
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
