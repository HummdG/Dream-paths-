"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { formatDistanceToNow } from "date-fns";
import {
  Rocket,
  Trophy,
  Clock,
  CheckCircle,
  Play,
  Settings,
  LogOut,
  Star,
  Crown,
  Sparkles,
  Pencil,
} from "lucide-react";
import { CodingMissions } from "@/components/dashboard/coding-missions";
import { platformerMissionPack } from "@/lib/missions";

interface Mission {
  id: string;
  sequenceNumber: number;
  title: string;
  storyIntro: string;
  estimatedDuration: number;
  status: "LOCKED" | "AVAILABLE" | "COMPLETED";
  completedAt: string | null;
}

interface DashboardClientProps {
  parentName: string;
  childName: string;
  childAge: number;
  pathName: string;
  completedMissions: number;
  totalMissions: number;
  missions: Mission[];
  nextMission: {
    id: string;
    sequenceNumber: number;
    title: string;
    storyIntro: string;
    estimatedDuration: number;
  } | null;
  lastCompleted: {
    title: string;
    completedAt: string;
  } | null;
  subscriptionPlan: string;
  codingMissions?: {
    completedMissionIds: string[];
    totalStars: number;
    badges: string[];
  };
  heroCharacter?: {
    name: string;
    pixels: string[][];
  } | null;
}

export function DashboardClient({
  parentName,
  childName,
  childAge,
  pathName,
  completedMissions,
  totalMissions,
  missions,
  nextMission,
  lastCompleted,
  subscriptionPlan,
  codingMissions,
  heroCharacter,
}: DashboardClientProps) {
  const codingCompleted = codingMissions?.completedMissionIds.length ?? 0;
  const codingTotal = platformerMissionPack.missions.length;
  const progressPercent = codingTotal > 0 ? (codingCompleted / codingTotal) * 100 : 0;
  const isFree = subscriptionPlan === "free";
  const maxFreeMissions = 2;

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-2 flex justify-between items-center">
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

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome & Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-[var(--color-navy)] mb-2">
            {childName}'s Dashboard
          </h1>
          <div className="flex items-center gap-4 text-gray-600">
            <span className="flex items-center gap-1">
              <Rocket className="w-4 h-4 text-[var(--color-violet)]" />
              {pathName}
            </span>
            <span>•</span>
            <span>{childAge} years old</span>
            {isFree && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-600">
                  <Star className="w-4 h-4" />
                  Free Trial
                </span>
              </>
            )}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-[var(--color-navy)] flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[var(--color-coral)]" />
                  Progress
                </h2>
                <span className="text-sm text-gray-500">
                  {codingCompleted} of {codingTotal} missions
                </span>
              </div>

              <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[var(--color-indigo)] to-[var(--color-violet)] rounded-full"
                />
              </div>

              {lastCompleted && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Last completed: <strong>{lastCompleted.title}</strong>
                  <span className="text-gray-400">
                    ({formatDistanceToNow(new Date(lastCompleted.completedAt), { addSuffix: true })})
                  </span>
                </div>
              )}
            </motion.div>

            {/* Coding Missions Section */}
            {codingMissions && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <CodingMissions
                  completedMissionIds={codingMissions.completedMissionIds}
                  totalStars={codingMissions.totalStars}
                  badges={codingMissions.badges}
                />
              </motion.div>
            )}

            {/* Next Mission Card */}
            {nextMission && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card bg-gradient-to-br from-[var(--color-indigo)] to-[var(--color-violet)] text-white"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-3xl shrink-0">
                    {"🎯"}
                  </div>
                  <div className="flex-1">
                    <p className="text-white/70 text-sm mb-1">Up Next</p>
                    <h3 className="text-xl font-bold mb-2">
                      Mission {nextMission.sequenceNumber}: {nextMission.title}
                    </h3>
                    <p className="text-white/80 text-sm mb-4 line-clamp-2">
                      {nextMission.storyIntro}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-sm text-white/70">
                        <Clock className="w-4 h-4" />
                        ~{nextMission.estimatedDuration} min
                      </span>
                      <Link
                        href={`/mission/${nextMission.id}`}
                        className="inline-flex items-center gap-2 bg-white text-[var(--color-indigo)] font-bold px-6 py-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        Start Mission
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {!nextMission && completedMissions === totalMissions && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card text-center py-12"
              >
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-[var(--color-navy)] mb-2">
                  Congratulations!
                </h2>
                <p className="text-gray-600 mb-6">
                  {childName} has completed all missions in the Junior Game Developer path!
                </p>
                <p className="text-sm text-gray-500">
                  More paths coming soon...
                </p>
              </motion.div>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Hero Character Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[var(--color-navy)] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-500" />
                  My Hero
                </h3>
                {heroCharacter && (
                  <Link
                    href="/play/m0_design_hero"
                    className="text-violet-600 hover:text-violet-700 transition-colors"
                    title="Edit Hero"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                )}
              </div>

              {heroCharacter ? (
                <div className="flex flex-col items-center">
                  <div className="bg-gradient-to-br from-violet-100 to-indigo-100 p-4 rounded-xl mb-3">
                    <div
                      className="grid"
                      style={{
                        gridTemplateColumns: `repeat(16, 5px)`,
                        imageRendering: "pixelated",
                      }}
                    >
                      {heroCharacter.pixels.map((row, y) =>
                        row.map((color, x) => (
                          <div
                            key={`${x}-${y}`}
                            style={{
                              width: 5,
                              height: 5,
                              backgroundColor:
                                color === "transparent" ? "transparent" : color,
                            }}
                          />
                        ))
                      )}
                    </div>
                  </div>
                  <p className="font-medium text-[var(--color-navy)]">
                    {heroCharacter.name}
                  </p>
                </div>
              ) : (
                <Link
                  href="/play/m0_design_hero"
                  className="block text-center py-6 bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl border-2 border-dashed border-violet-200 hover:border-violet-400 transition-all group"
                >
                  <div className="text-4xl mb-2">🎨</div>
                  <p className="text-violet-700 font-medium group-hover:text-violet-900">
                    Start Mission 0!
                  </p>
                  <p className="text-xs text-violet-500 mt-1">
                    Design your pixel art hero
                  </p>
                </Link>
              )}
            </motion.div>

            {/* Upgrade Card (if free) */}
            {isFree && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-amber-900">Unlock All Missions</h3>
                </div>
                <p className="text-sm text-amber-800 mb-4">
                  {childName} is doing great! Upgrade to continue with all 8 missions.
                </p>
                <Link
                  href="/upgrade"
                  className="block w-full text-center bg-gradient-to-r from-amber-400 to-orange-400 text-white font-bold py-3 px-4 rounded-xl hover:from-amber-500 hover:to-orange-500 transition-all"
                >
                  Upgrade for £9/month
                </Link>
              </motion.div>
            )}

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card"
            >
              <h3 className="font-bold text-[var(--color-navy)] mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Missions Completed</span>
                  <span className="font-bold text-[var(--color-navy)]">
                    {codingCompleted}/{codingTotal}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Current Path</span>
                  <span className="font-medium text-[var(--color-violet)]">{pathName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Plan</span>
                  <span
                    className={`font-medium ${isFree ? "text-amber-600" : "text-green-600"}`}
                  >
                    {isFree ? "Free Trial" : "Founding Family"}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Settings Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link
                href="/settings"
                className="card flex items-center gap-3 hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">Account Settings</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

