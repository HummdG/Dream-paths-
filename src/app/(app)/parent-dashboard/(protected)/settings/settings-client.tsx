"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  ArrowLeft,
  User,
  Mail,
  LogOut,
  Trash2,
  CheckCircle,
  Crown,
  Loader2,
  ExternalLink,
  Zap,
} from "lucide-react";
import { PLANS } from "@/lib/plans";

interface SubscriptionInfo {
  planId: string;
  hasStripeCustomer: boolean;
  purchasedPathIds: string[];
}

interface SettingsClientProps {
  email: string;
  name: string | null;
  subscription: SubscriptionInfo;
}

// ─── Subscription section ────────────────────────────────────────────────────

const ALL_PATH_CARDS = [
  { pathId: "computer_scientist", label: "Computer Scientist", emoji: "💻" },
  { pathId: "astronaut", label: "Astronaut", emoji: "🚀" },
  { pathId: "doctor", label: "Doctor", emoji: "🩺" },
];

function SubscriptionSection({ subscription }: { subscription: SubscriptionInfo }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isDreamStudio = subscription.planId === PLANS.DREAM_STUDIO;
  const activePaths = ALL_PATH_CARDS.filter((c) =>
    subscription.purchasedPathIds.includes(c.pathId)
  );
  const inactivePaths = ALL_PATH_CARDS.filter(
    (c) => !subscription.purchasedPathIds.includes(c.pathId)
  );
  const hasActivePaths = activePaths.length > 0;

  async function handleManage() {
    setLoading("portal");
    setError(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to open billing portal");
      setLoading(null);
    }
  }

  async function handleSubscribePath(pathId: string) {
    setLoading(pathId);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "path", pathId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start checkout");
      setLoading(null);
    }
  }

  async function handleSubscribeDreamStudio() {
    setLoading("dream_studio");
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "dream_studio" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start checkout");
      setLoading(null);
    }
  }

  // Plan badge text
  const planBadge = isDreamStudio
    ? "🌟 Dream Studio"
    : activePaths.length > 0
      ? `${activePaths.map((c) => c.emoji).join("")} ${activePaths.length} Path${activePaths.length > 1 ? "s" : ""}`
      : "Free plan";

  const planBadgeClass = isDreamStudio
    ? "bg-amber-50 text-amber-700 border-amber-200"
    : hasActivePaths
      ? "bg-violet-50 text-violet-700 border-violet-200"
      : "bg-gray-100 text-gray-500 border-transparent";

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-[var(--color-navy)] flex items-center gap-2">
          <Crown className="w-5 h-5 text-[var(--color-violet)]" />
          Subscription
        </h2>
        <span className={`text-xs font-semibold border px-3 py-1 rounded-full ${planBadgeClass}`}>
          {planBadge}
        </span>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Dream Studio active */}
      {isDreamStudio && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-4 mb-4">
          <p className="text-sm font-semibold text-amber-800 mb-1">You have Dream Studio</p>
          <p className="text-sm text-amber-700">
            Unlimited access to all career paths — current and future.
          </p>
          {subscription.hasStripeCustomer && (
            <button
              onClick={handleManage}
              disabled={loading !== null}
              className="mt-3 flex items-center gap-1.5 text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors disabled:opacity-50"
            >
              {loading === "portal" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ExternalLink className="w-3.5 h-3.5" />
              )}
              Manage billing
            </button>
          )}
        </div>
      )}

      {/* Active paths */}
      {!isDreamStudio && activePaths.length > 0 && (
        <div className="space-y-3 mb-4">
          {activePaths.map((card) => (
            <div
              key={card.pathId}
              className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{card.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-violet-800">{card.label} — active</p>
                  <p className="text-xs text-violet-600">£24.99/month</p>
                </div>
              </div>
              {subscription.hasStripeCustomer && (
                <button
                  onClick={handleManage}
                  disabled={loading !== null}
                  className="flex items-center gap-1 text-xs font-medium text-violet-700 hover:text-violet-900 transition-colors disabled:opacity-50"
                >
                  {loading === "portal" ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <ExternalLink className="w-3 h-3" />
                  )}
                  Manage
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add a Career Path section (shown when not Dream Studio and at least one path exists to buy) */}
      {!isDreamStudio && inactivePaths.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-semibold text-[var(--color-navy)] mb-3">
            {hasActivePaths ? "Add another career path" : "Add a career path"}
          </p>
          {!hasActivePaths && (
            <p className="text-sm text-gray-500 mb-3">
              Each path is £24.99/month and unlocks the full curriculum for that career.
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {inactivePaths.map((card) => (
              <div
                key={card.pathId}
                className="border-2 border-[var(--color-violet)] rounded-xl p-3 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{card.emoji}</span>
                  <div>
                    <p className="text-sm font-bold text-[var(--color-navy)]">{card.label}</p>
                    <p className="text-xs text-gray-400">£24.99/month</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSubscribePath(card.pathId)}
                  disabled={loading !== null}
                  className="w-full py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-[var(--color-indigo)] to-[var(--color-violet)] text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {loading === card.pathId ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : null}
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dream Studio upsell (shown when on path plan but not Dream Studio) */}
      {!isDreamStudio && (
        <div className="border border-amber-200 rounded-xl p-4 bg-amber-50">
          <div className="flex items-start gap-3">
            <Zap className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">Dream Studio — £39.99/month</p>
              <p className="text-xs text-amber-700 mt-0.5">
                All career paths, unlimited child profiles, future paths included.
              </p>
            </div>
            <button
              onClick={handleSubscribeDreamStudio}
              disabled={loading !== null}
              className="shrink-0 text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-1"
            >
              {loading === "dream_studio" ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : null}
              Upgrade
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function SettingsClient({ email, name, subscription }: SettingsClientProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center">
          <Link
            href="/parent-dashboard"
            className="flex items-center gap-2 text-gray-600 hover:text-[var(--color-navy)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Parent Dashboard</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-[var(--color-navy)] mb-8">Account Settings</h1>

          <div className="space-y-6">
            {/* Account Info */}
            <div className="card">
              <h2 className="text-lg font-bold text-[var(--color-navy)] mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[var(--color-violet)]" />
                Account Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Email</label>
                  <div className="flex items-center gap-2 text-[var(--color-navy)]">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {email}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Name</label>
                  <p className="text-[var(--color-navy)]">{name || "Not set"}</p>
                </div>
              </div>
            </div>

            {/* Subscription */}
            <SubscriptionSection subscription={subscription} />

            {/* Sign Out */}
            <div className="card">
              <h2 className="text-lg font-bold text-[var(--color-navy)] mb-4">Session</h2>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 text-gray-600 hover:text-[var(--color-navy)] transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sign out of your account
              </button>
            </div>

            {/* Danger Zone */}
            <div className="card border-2 border-red-100">
              <h2 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Danger Zone
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Once you delete your account, all of your data will be permanently removed. This
                action cannot be undone.
              </p>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-red-600 hover:text-red-700 font-medium text-sm"
                >
                  Delete my account
                </button>
              ) : (
                <div className="bg-red-50 rounded-xl p-4">
                  <p className="text-red-700 text-sm mb-4">
                    Are you sure? This will permanently delete your account and all associated data.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="btn-secondary py-2 px-4 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        alert("Account deletion will be available soon. Please contact support.");
                      }}
                      className="bg-red-600 text-white py-2 px-4 rounded-full text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      Yes, delete my account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
