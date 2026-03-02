"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Code2,
  Play,
  CheckCircle,
  Lock,
  Star,
  Trophy,
  Gamepad2,
} from "lucide-react";
import { MissionPack, Mission } from "@/lib/missions";

interface CodingMissionsProps {
  pack: MissionPack;
  completedMissionIds: string[];
  totalStars: number;
  badges: string[];
  /** Render the card in a locked/greyed-out state with a custom message */
  locked?: boolean;
  lockedMessage?: string;
}

export function CodingMissions({
  pack,
  completedMissionIds,
  totalStars,
  badges,
  locked = false,
  lockedMessage,
}: CodingMissionsProps) {
  const missions = pack.missions;

  // Determine which missions are available
  const getMissionStatus = (mission: Mission, index: number): 'completed' | 'available' | 'locked' => {
    if (locked) return 'locked';
    if (completedMissionIds.includes(mission.missionId)) {
      return 'completed';
    }
    // First mission is always available, others require previous completion
    if (index === 0 || completedMissionIds.includes(missions[index - 1].missionId)) {
      return 'available';
    }
    return 'locked';
  };

  // Pick a colour theme based on pack ID
  const isSnakePack = pack.packId === 'snake_basics_v1';
  const headerGradient = isSnakePack
    ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
    : 'bg-gradient-to-br from-violet-500 to-indigo-600';
  const progressGradient = isSnakePack
    ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
    : 'bg-gradient-to-r from-violet-500 to-indigo-500';

  // Icons for each mission slot
  const snakeIcons = ['🐍', '⚙️', '⌨️', '🏆'];
  const platformerIcons = ['🎨', '🎮', '📍', '🏃', '⌨️', '🧱', '🦘', '💥', '🪙', '👾', '🏁'];
  const missionIcons = isSnakePack ? snakeIcons : platformerIcons;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card ${locked ? 'opacity-75' : ''}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${headerGradient} rounded-2xl flex items-center justify-center`}>
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--color-navy)]">
              {pack.packTitle}
            </h2>
            <p className="text-sm text-gray-500">{pack.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {locked && (
            <div className="flex items-center gap-1 text-gray-400">
              <Lock className="w-5 h-5" />
            </div>
          )}
          {!locked && (
            <>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-5 h-5 fill-yellow-400" />
                <span className="font-bold">{totalStars}</span>
              </div>
              {badges.length > 0 && (
                <div className="flex items-center gap-1 text-violet-500">
                  <Trophy className="w-5 h-5" />
                  <span className="font-medium">{badges.length}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Locked overlay message */}
      {locked && lockedMessage && (
        <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 flex items-center gap-2">
          <Lock className="w-4 h-4 shrink-0" />
          {lockedMessage}
        </div>
      )}

      {/* Progress bar */}
      {!locked && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>{completedMissionIds.length} of {missions.length} missions complete</span>
            <span>{Math.round((completedMissionIds.length / missions.length) * 100)}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedMissionIds.length / missions.length) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full ${progressGradient} rounded-full`}
            />
          </div>
        </div>
      )}

      {/* Mission list */}
      <div className="space-y-3">
        {missions.map((mission, index) => {
          const status = getMissionStatus(mission, index);
          const isCompleted = status === 'completed';
          const isAvailable = status === 'available';
          const isLocked = status === 'locked';
          const availableRingColor = isSnakePack ? 'ring-emerald-300' : 'ring-violet-300';
          const availableBg = isSnakePack
            ? 'bg-gradient-to-r from-emerald-50 to-teal-50'
            : 'bg-gradient-to-r from-violet-50 to-indigo-50';
          const availableIconBg = isSnakePack
            ? 'bg-gradient-to-br from-emerald-500 to-teal-600'
            : 'bg-gradient-to-br from-violet-500 to-indigo-600';
          const playBtnCls = isSnakePack
            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
            : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700';

          return (
            <div
              key={mission.missionId}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                isAvailable
                  ? `${availableBg} ring-2 ${availableRingColor}`
                  : isCompleted
                  ? "bg-emerald-50"
                  : "bg-gray-50 opacity-60"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                  isCompleted
                    ? "bg-emerald-100"
                    : isAvailable
                    ? availableIconBg
                    : "bg-gray-200"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                ) : isLocked ? (
                  <Lock className="w-5 h-5 text-gray-400" />
                ) : (
                  <span className="text-white">{missionIcons[index] || '🎯'}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">
                  {mission.missionType === 'creative' ? '✨ Creative Mission' : `Mission ${index + 1}`}
                </p>
                <h3
                  className={`font-semibold truncate ${
                    isLocked ? "text-gray-400" : "text-[var(--color-navy)]"
                  }`}
                >
                  {mission.title.replace(/^Mission \d+:\s*/, '')}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">
                    ~{mission.estimatedMinutes} min
                  </span>
                  <span className="text-xs text-gray-300">•</span>
                  <span className="text-xs text-gray-500">
                    {mission.missionType === 'creative' ? '🎨 Design' : `${mission.steps.length} steps`}
                  </span>
                </div>
              </div>

              {isAvailable && (
                <Link
                  href={`/play/${mission.missionId}`}
                  className={`flex items-center gap-2 ${playBtnCls} text-white font-bold px-4 py-2 rounded-xl transition-all shrink-0`}
                >
                  {mission.missionType === 'creative' ? (
                    <>
                      <span className="text-sm">🎨</span>
                      Create
                    </>
                  ) : (
                    <>
                      <Gamepad2 className="w-4 h-4" />
                      Play
                    </>
                  )}
                </Link>
              )}

              {isCompleted && (
                <Link
                  href={`/play/${mission.missionId}`}
                  className="flex items-center gap-2 bg-emerald-100 text-emerald-700 font-medium px-4 py-2 rounded-xl hover:bg-emerald-200 transition-all shrink-0"
                >
                  <Play className="w-4 h-4" />
                  Replay
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Learning outcomes */}
      {!locked && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-3">What you&apos;ll learn:</h4>
          <div className="flex flex-wrap gap-2">
            {pack.learningOutcomes.slice(0, 6).map((outcome) => (
              <span
                key={outcome}
                className={`px-2 py-1 rounded-full text-xs ${
                  isSnakePack
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-violet-100 text-violet-700'
                }`}
              >
                {outcome}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
