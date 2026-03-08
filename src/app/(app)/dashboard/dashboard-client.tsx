"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { LogOut, Crown, Pencil, Settings, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { CareerPathGrid } from "@/components/dashboard/career-path-grid";
import type { CareerPathEntry } from "@/components/dashboard/career-path-grid";
import { PLANS } from "@/lib/plans";

interface DashboardClientProps {
  parentName: string;
  childName: string;
  subscriptionPlan: string;
  purchasedPathIds: string[];
  careerPathsProgress: CareerPathEntry[];
  heroCharacter?: {
    name: string;
    pixels: string[][];
  } | null;
}

export function DashboardClient({
  parentName,
  childName,
  subscriptionPlan,
  purchasedPathIds,
  careerPathsProgress,
  heroCharacter,
}: DashboardClientProps) {
  const isDreamStudio = subscriptionPlan === PLANS.DREAM_STUDIO;
  const isFree = !isDreamStudio && purchasedPathIds.length === 0;
  const planLabel = isDreamStudio
    ? "Dream Studio"
    : purchasedPathIds.length > 0
      ? `${purchasedPathIds.length} Path${purchasedPathIds.length > 1 ? "s" : ""}`
      : null;

  // Aggregate stats across all paths
  const totalCompleted = careerPathsProgress.reduce(
    (sum, e) =>
      sum + e.packsProgress.reduce((s, pp) => s + pp.completedMissionIds.length, 0),
    0
  );
  const totalMissions = careerPathsProgress.reduce(
    (sum, e) =>
      sum + e.packsProgress.reduce((s, pp) => s + pp.pack.missions.length, 0),
    0
  );
  const totalStars = careerPathsProgress.reduce(
    (sum, e) => sum + e.packsProgress.reduce((s, pp) => s + pp.totalStars, 0),
    0
  );

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-2 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="DreamPaths"
              width={550}
              height={180}
              priority
              className="h-12 sm:h-16 md:h-20 lg:h-24 w-auto"
            />
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Hi, {parentName}!</span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* ── Profile bar ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6 flex items-center gap-5"
        >
          {/* Hero avatar */}
          <div className="relative shrink-0">
            {heroCharacter ? (
              <>
                <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-2xl overflow-hidden flex items-center justify-center">
                  <div
                    className="grid"
                    style={{
                      gridTemplateColumns: `repeat(16, 4px)`,
                      imageRendering: "pixelated",
                    }}
                  >
                    {heroCharacter.pixels.map((row, y) =>
                      row.map((color, x) => (
                        <div
                          key={`${x}-${y}`}
                          style={{
                            width: 4,
                            height: 4,
                            backgroundColor:
                              color === "transparent" ? "transparent" : color,
                          }}
                        />
                      ))
                    )}
                  </div>
                </div>
                <Link
                  href="/play/m0_design_hero"
                  title="Edit hero"
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Pencil className="w-2.5 h-2.5 text-gray-500" />
                </Link>
              </>
            ) : (
              <Link
                href="/play/m0_design_hero"
                className="block w-16 h-16 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl border-2 border-dashed border-violet-300 flex items-center justify-center hover:border-violet-500 transition-colors"
                title="Create your hero"
              >
                <span className="text-2xl">🎨</span>
              </Link>
            )}
          </div>

          {/* Name + stats */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h1 className="text-xl font-bold text-[var(--color-navy)]">
                {childName}&apos;s Journey
              </h1>
              {isFree ? (
                <span className="text-xs text-amber-600 font-medium bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  Free
                </span>
              ) : planLabel ? (
                <span className="text-xs text-violet-700 font-medium bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  {planLabel}
                </span>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-500">
              <span>
                {totalCompleted}/{totalMissions} missions
              </span>
              <span>⭐ {totalStars} stars</span>
            </div>
          </div>

          {/* Actions */}
          <div className="shrink-0 flex items-center gap-2">
            <Link
              href="/parent-dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors text-xs font-medium"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Parent Area</span>
            </Link>
          </div>
        </motion.div>

        {/* ── New-user: hero creation CTA ─────────────────────────────── */}
        {!heroCharacter && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <Link href="/play/m0_design_hero" className="block group">
              <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-violet-500 to-indigo-600 rounded-2xl text-white hover:from-violet-600 hover:to-indigo-700 transition-all shadow-md">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-3xl shrink-0">
                  🎨
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/70 text-xs font-medium mb-0.5 uppercase tracking-wide">
                    Start here
                  </p>
                  <h3 className="font-bold text-lg leading-tight">
                    Design your hero character!
                  </h3>
                  <p className="text-white/75 text-sm mt-0.5">
                    Create your pixel art avatar to begin your coding adventure
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-white/70 shrink-0 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        )}

        {/* ── Career path grid ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <CareerPathGrid careerPaths={careerPathsProgress} />
        </motion.div>
      </main>
    </div>
  );
}
