"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Lock } from "lucide-react";
import type { PackProgress } from "@/lib/missions";

interface PackTheme {
  gradient: string;
  dot: string;
  bar: string;
  emoji: string;
}

const PACK_THEMES: Record<string, PackTheme> = {
  snake_basics_v1: {
    gradient: "from-emerald-500 to-teal-600",
    dot: "border-emerald-500",
    bar: "from-emerald-400 to-teal-400",
    emoji: "🐍",
  },
  platformer_v1: {
    gradient: "from-violet-500 to-indigo-600",
    dot: "border-violet-500",
    bar: "from-violet-400 to-indigo-400",
    emoji: "🎮",
  },
  rocket_basics_v1: {
    gradient: "from-indigo-500 to-purple-600",
    dot: "border-indigo-500",
    bar: "from-indigo-400 to-purple-400",
    emoji: "🚀",
  },
  astronaut_v1: {
    gradient: "from-blue-600 to-indigo-700",
    dot: "border-blue-600",
    bar: "from-blue-400 to-indigo-500",
    emoji: "👨‍🚀",
  },
  patient_monitor_basics_v1: {
    gradient: "from-cyan-500 to-teal-600",
    dot: "border-cyan-500",
    bar: "from-cyan-400 to-teal-400",
    emoji: "🏥",
  },
  doctor_v1: {
    gradient: "from-rose-500 to-pink-600",
    dot: "border-rose-500",
    bar: "from-rose-400 to-pink-400",
    emoji: "🩺",
  },
  default: {
    gradient: "from-blue-500 to-cyan-600",
    dot: "border-blue-500",
    bar: "from-blue-400 to-cyan-400",
    emoji: "⭐",
  },
};

interface GameNodeProps {
  packProgress: PackProgress;
  isLeft: boolean;
  index: number;
}

export function GameNode({ packProgress, isLeft, index }: GameNodeProps) {
  const { pack, completedMissionIds, totalStars, locked, lockedMessage } = packProgress;
  const theme = PACK_THEMES[pack.packId] ?? PACK_THEMES.default;
  const completedCount = completedMissionIds.length;
  const totalCount = pack.missions.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const card = (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={`relative rounded-2xl overflow-hidden shadow-md border border-white/50 w-full max-w-xs ${
        locked ? "opacity-60" : "hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
      }`}
    >
      {/* Card header */}
      <div className={`bg-gradient-to-br ${theme.gradient} p-4 flex items-center gap-3`}>
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl shrink-0">
          {locked ? <Lock className="w-6 h-6 text-white/80" /> : theme.emoji}
        </div>
        <div className="min-w-0">
          <h3 className="text-white font-bold text-lg leading-tight truncate">{pack.packTitle}</h3>
          <p className="text-white/70 text-xs mt-0.5 line-clamp-1">{pack.description}</p>
        </div>
      </div>

      {/* Card body */}
      <div className="bg-white p-4">
        {locked && lockedMessage ? (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            {lockedMessage}
          </p>
        ) : (
          <>
            {/* Progress bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>
                  {completedCount} / {totalCount} missions
                </span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r ${theme.bar} rounded-full`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>⭐ {totalStars} stars</span>
              <span className={`font-semibold bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                {completedCount === totalCount && totalCount > 0 ? "Complete!" : "Play →"}
              </span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );

  if (locked) {
    return card;
  }

  return (
    <Link href={`/games/${pack.packId}`} className="block">
      {card}
    </Link>
  );
}
