"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { PLANS } from '@/lib/plans'

interface UpgradeClientProps {
  currentPlanId: string
  hasStripeCustomer: boolean
  isSuccess: boolean
  purchasedPathIds: string[]
}

const CAREER_PATH_CARDS = [
  {
    pathId: 'computer_scientist',
    label: 'Computer Scientist',
    emoji: '💻',
    price: '£24.99',
    tagline: 'Python through real game-building',
    features: [
      '12 missions across 2 games',
      'Snake + Platformer paths',
      '1 child profile',
    ],
  },
]

export function UpgradeClient({ currentPlanId, hasStripeCustomer, isSuccess, purchasedPathIds }: UpgradeClientProps) {
  const { update: updateSession } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isDreamStudio = currentPlanId === PLANS.DREAM_STUDIO
  const isPaid = isDreamStudio || purchasedPathIds.length > 0

  async function handleSubscribePath(pathId: string) {
    setLoading(pathId)
    setError(null)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'path', pathId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong')
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start checkout')
      setLoading(null)
    }
  }

  async function handleSubscribeDreamStudio() {
    setLoading('dream_studio')
    setError(null)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'dream_studio' }),
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

  const csCard = CAREER_PATH_CARDS[0]
  const csActive = purchasedPathIds.includes(csCard.pathId)

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-600 hover:text-[var(--color-navy)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Success banner */}
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-5 py-4 rounded-2xl"
          >
            <CheckCircle className="w-5 h-5 shrink-0 text-green-500" />
            <div>
              <p className="font-semibold">You&apos;re all set!</p>
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
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-navy)] mb-3">
            {isPaid ? 'Your Plan' : 'Choose your plan'}
          </h1>
          <p className="text-gray-500">
            {isPaid ? 'Manage your subscription below.' : 'Start free, upgrade when ready.'}
          </p>
        </motion.div>

        {isPaid && hasStripeCustomer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <button
              onClick={handleManage}
              disabled={loading === 'portal'}
              className="btn-primary px-8 py-3"
            >
              {loading === 'portal' ? 'Opening…' : 'Manage Subscription'}
            </button>
          </motion.div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {!isDreamStudio && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">

            {/* Free card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-2xl p-6 flex flex-col border border-gray-100"
            >
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 h-5">Free</p>
              <div className="mb-5 h-10 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[var(--color-navy)]">£0</span>
                <span className="text-gray-400 text-sm">forever</span>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {['Snake tutorial (4 missions)', 'Pixel art hero creator', '1 child profile'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <div className="w-full py-3 text-center rounded-full bg-gray-100 text-gray-400 text-sm font-semibold">
                  Current plan
                </div>
              </div>
            </motion.div>

            {/* Computer Scientist card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 flex flex-col ring-2 ring-[var(--color-violet)]"
            >
              <div className="flex items-center justify-between mb-3 h-5">
                <p className="text-xs font-semibold text-[var(--color-violet)] uppercase tracking-wide">{csCard.label}</p>
                <span className="bg-[var(--color-violet)] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">Popular</span>
              </div>
              <div className="mb-5 h-10 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[var(--color-navy)]">{csCard.price}</span>
                <span className="text-gray-400 text-sm">/month</span>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {csCard.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle className="w-3.5 h-3.5 text-[var(--color-violet)] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                {csActive ? (
                  <div className="w-full py-3 text-center rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                    ✓ Active
                  </div>
                ) : (
                  <button
                    onClick={() => handleSubscribePath(csCard.pathId)}
                    disabled={loading !== null}
                    className="w-full py-3 rounded-full font-semibold text-sm bg-gradient-to-r from-[var(--color-indigo)] to-[var(--color-violet)] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {loading === csCard.pathId ? 'Redirecting…' : 'Get Started'}
                  </button>
                )}
              </div>
            </motion.div>

            {/* Dream Studio card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl p-6 flex flex-col ring-2 ring-amber-400"
            >
              <div className="flex items-center justify-between mb-3 h-5">
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Dream Studio</p>
                <span className="bg-amber-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">All Access</span>
              </div>
              <div className="mb-5 h-10 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[var(--color-navy)]">£39.99</span>
                <span className="text-gray-400 text-sm">/month</span>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {['All career paths', 'Future paths included', 'Unlimited child profiles', 'Priority support'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <button
                  onClick={handleSubscribeDreamStudio}
                  disabled={loading !== null}
                  className="w-full py-3 rounded-full font-semibold text-sm bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading === 'dream_studio' ? 'Redirecting…' : 'Get Dream Studio'}
                </button>
              </div>
            </motion.div>

          </div>
        )}

        {/* Dream Studio active state */}
        {isDreamStudio && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="card ring-2 ring-amber-400 text-center"
          >
            <div className="text-5xl mb-4">🌟</div>
            <h3 className="text-xl font-bold text-[var(--color-navy)] mb-2">Dream Studio</h3>
            <p className="text-gray-500">You have unlimited access to all paths, current and future.</p>
          </motion.div>
        )}
      </main>
    </div>
  )
}
