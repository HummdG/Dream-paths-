"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Crown, Sparkles } from "lucide-react";

export default function UpgradePage() {
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

      <main className="max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-[var(--color-peach)] text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Upgrade to continue
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-navy)] mb-4">
            Unlock the Full Adventure
          </h1>
          <p className="text-lg text-gray-600">
            Your child is doing amazing! Upgrade to access all 8 missions 
            and keep the learning journey going.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card ring-2 ring-[var(--color-violet)] relative mb-8"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[var(--color-indigo)] to-[var(--color-violet)] text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Crown className="w-4 h-4" />
            Founding Family
          </div>

          <div className="text-center pt-4 pb-6 border-b border-gray-100 mb-6">
            <div className="text-5xl font-bold text-[var(--color-navy)] mb-2">
              £24.99 <span className="text-base font-normal text-gray-500">/month</span>
            </div>
            <p className="text-gray-500">Cancel anytime</p>
          </div>

          <ul className="space-y-4 mb-8">
            {[
              "All 8 missions in Junior Game Developer",
              "New dream paths as we launch them",
              "Up to 2 child profiles",
              "Priority email support",
              "Early access to new features",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[var(--color-violet)] shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => {
              // TODO: Integrate Stripe payment
              alert("Payment integration coming soon! For now, enjoy the free missions.");
            }}
            className="btn-primary w-full text-center text-lg py-4"
          >
            Upgrade Now
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card bg-gray-50 text-center"
        >
          <p className="text-gray-600 text-sm mb-2">
            💡 <strong>Coming soon:</strong> Payment processing via Stripe
          </p>
          <p className="text-gray-500 text-sm">
            For early access or questions, email us at{" "}
            <a href="mailto:hello@dreampathkids.com" className="text-[var(--color-violet)] hover:underline">
              hello@dreampathkids.com
            </a>
          </p>
        </motion.div>
      </main>
    </div>
  );
}






