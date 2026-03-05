"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { LogOut, ArrowLeft, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { GamePath } from "@/components/dashboard/game-path";
import { CAREER_PATHS } from "@/lib/plans";
import type { PackProgress } from "@/lib/missions";

interface PathClientProps {
  pathId: string;
  packsProgress: PackProgress[];
  heroPixels?: string[][] | null;
}

export function PathClient({ pathId, packsProgress, heroPixels }: PathClientProps) {
  const meta = CAREER_PATHS[pathId];
  const completedCount = packsProgress.reduce(
    (sum, pp) => sum + pp.completedMissionIds.length,
    0
  );
  const totalCount = packsProgress.reduce(
    (sum, pp) => sum + pp.pack.missions.length,
    0
  );
  const totalStars = packsProgress.reduce((sum, pp) => sum + pp.totalStars, 0);

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-2 flex justify-between items-center">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-600 hover:text-[var(--color-navy)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <Link href="/dashboard">
            <Image
              src="/logo.svg"
              alt="DreamPaths"
              width={550}
              height={180}
              priority
              className="h-10 sm:h-12 w-auto"
            />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/parent-dashboard"
              title="Parent dashboard"
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Path hero banner */}
        {meta && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-r ${meta.gradient} rounded-2xl p-6 text-white mb-8`}
          >
            <div className="text-4xl mb-3">{meta.emoji}</div>
            <h1 className="text-2xl font-bold mb-1">{meta.label}</h1>
            <p className="text-white/80 text-sm mb-4">{meta.tagline}</p>
            <div className="flex gap-6 text-sm text-white/80">
              <span>
                {completedCount}/{totalCount} missions
              </span>
              <span>⭐ {totalStars} stars</span>
            </div>
          </motion.div>
        )}

        {/* Pack path map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GamePath packs={packsProgress} heroPixels={heroPixels} />
        </motion.div>
      </main>
    </div>
  );
}
