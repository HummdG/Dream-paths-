"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Crown, Sparkles, Star } from 'lucide-react'
import { PLANS, PLAN_FEATURES } from '@/lib/plans'

interface UpgradeClientProps {
  currentPlanId: string
  hasStripeCustomer: boolean
  isSuccess: boolean
}

const PLAN_CARDS = [
  {
    id: PLANS.FOUNDING_FAMILY,
    label: 'Founding Family',
    price: '£24.99',
    tagline: 'Perfect for growing families',
    features: [
      'All missions in every current learning path',
      'Snake game + Platformer game paths',
      'Up to 2 child profiles',
      'Priority email support',
      'Early access to new features',
    ],
    gradient: 'from-[var(--color-indigo)] to-[var(--color-violet)]',
    ring: 'ring-[var(--color-violet)]',
    icon: <Crown className="w-4 h-4" />,
  },
  {
    id: PLANS.DREAM_STUDIO,
    label: 'Dream Studio',
    price: '£39.99',
    tagline: 'Unlimited creativity, unlimited kids',
    features: [
      'Everything in Founding Family',
      'Unlimited child profiles',
      'All current + future learning paths',
      'Dedicated support',
      'Founding member badge',
    ],
    gradient: 'from-amber-500 to-orange-500',
    ring: 'ring-amber-400',
    icon: <Star className="w-4 h-4" />,
  },
]

export function UpgradeClient({ currentPlanId, hasStripeCustomer, isSuccess }: UpgradeClientProps) {
  const { update: updateSession } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isPaid = currentPlanId === PLANS.FOUNDING_FAMILY || currentPlanId === PLANS.DREAM_STUDIO
  const currentFeatures = PLAN_FEATURES[currentPlanId]

  async function handleSubscribe(planId: string) {
    setLoading(planId)
    setError(null)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start checkout')
      setLoading(null)
    }
  }

  async function handleManage() {
    setLoading('portal')
    setError(null)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to open billing portal')
      setLoading('portal')
    }
  }

  // After successful checkout, trigger session refresh once
  if (isSuccess) {
    updateSession().then(() => router.replace('/upgrade'))
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-600 hover:text-[var(--color-navy)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Success banner */}
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-5 py-4 rounded-2xl"
          >
            <CheckCircle className="w-5 h-5 shrink-0 text-green-500" />
            <div>
              <p className="font-semibold">Welcome to {currentFeatures?.label ?? 'your new plan'}!</p>
              <p className="text-sm text-green-700">Your subscription is now active. Enjoy the full adventure!</p>
            </div>
          </motion.div>
        )}

        {/* Hero heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-[var(--color-peach)] text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            {isPaid ? 'Your subscription' : 'Upgrade to continue'}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-navy)] mb-4">
            {isPaid ? 'You\'re on the full adventure' : 'Unlock the Full Adventure'}
          </h1>
          <p className="text-lg text-gray-600">
            {isPaid
              ? `Currently on ${currentFeatures?.label ?? currentPlanId} — ${currentFeatures?.price ?? ''}`
              : 'Choose a plan and keep the learning journey going.'}
          </p>
        </motion.div>

        {/* If already on paid plan: manage button */}
        {isPaid && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card text-center mb-8"
          >
            <p className="text-gray-600 mb-4">
              Manage or cancel your subscription at any time from the billing portal.
            </p>
            {hasStripeCustomer ? (
              <button
                onClick={handleManage}
                disabled={loading === 'portal'}
                className="btn-primary px-8 py-3"
              >
                {loading === 'portal' ? 'Opening…' : 'Manage Subscription'}
              </button>
            ) : (
              <p className="text-sm text-gray-400">Billing portal unavailable — contact support.</p>
            )}
          </motion.div>
        )}

        {/* Plan cards (always shown if free, or after success so they see what they got) */}
        {!isPaid && (
          <>
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {PLAN_CARDS.map((plan, i) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className={`card ring-2 ${plan.ring} relative`}
                >
                  <div
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r ${plan.gradient} text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1`}
                  >
                    {plan.icon}
                    {plan.label}
                  </div>

                  <div className="text-center pt-4 pb-5 border-b border-gray-100 mb-5">
                    <div className="text-4xl font-bold text-[var(--color-navy)] mb-1">
                      {plan.price}{' '}
                      <span className="text-base font-normal text-gray-500">/month</span>
                    </div>
                    <p className="text-sm text-gray-500">{plan.tagline}</p>
                  </div>

                  <ul className="space-y-3 mb-7">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-[var(--color-violet)] shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading !== null}
                    className="btn-primary w-full py-3 text-center"
                  >
                    {loading === plan.id ? 'Redirecting…' : 'Subscribe Now'}
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-2">Cancel anytime</p>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
