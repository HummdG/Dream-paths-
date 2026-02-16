"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  Circle,
  ExternalLink,
  Loader2,
  Sparkles,
  Trophy,
  PartyPopper,
} from "lucide-react";
import { Confetti } from "@/components/confetti";

interface MissionClientProps {
  missionId: string;
  sequenceNumber: number;
  title: string;
  storyIntro: string;
  goal: string;
  steps: string[];
  estimatedDuration: number;
  resources: string[] | null;
  isCompleted: boolean;
  childName: string;
}

const missionEmojis = ["🎨", "🏗️", "🏃", "⭐", "🔊", "🚧", "📋", "🚀"];

export function MissionClient({
  missionId,
  sequenceNumber,
  title,
  storyIntro,
  goal,
  steps,
  estimatedDuration,
  resources,
  isCompleted: initialCompleted,
  childName,
}: MissionClientProps) {
  const router = useRouter();
  const [checkedSteps, setCheckedSteps] = useState<boolean[]>(
    steps.map(() => initialCompleted)
  );
  const [isCompleting, setIsCompleting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isCompleted, setIsCompleted] = useState(initialCompleted);

  const allChecked = checkedSteps.every((checked) => checked);

  const toggleStep = (index: number) => {
    if (isCompleted) return;
    const newChecked = [...checkedSteps];
    newChecked[index] = !newChecked[index];
    setCheckedSteps(newChecked);
  };

  const handleComplete = async () => {
    if (isCompleted || isCompleting) return;

    setIsCompleting(true);

    try {
      const res = await fetch(`/api/missions/${missionId}/complete`, {
        method: "POST",
      });

      if (res.ok) {
        setIsCompleted(true);
        setShowCelebration(true);
      }
    } catch (error) {
      console.error("Failed to complete mission:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Confetti overlay */}
      <AnimatePresence>
        {showCelebration && <Confetti />}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-600 hover:text-[var(--color-navy)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </Link>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            ~{estimatedDuration} minutes
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Celebration Modal */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
              onClick={() => setShowCelebration(false)}
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ type: "spring", damping: 15 }}
                className="card max-w-md w-full text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="text-8xl mb-6"
                >
                  🎉
                </motion.div>

                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-[var(--color-navy)] mb-4"
                >
                  Amazing Job, {childName}!
                </motion.h2>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-gray-600 mb-6"
                >
                  You completed Mission {sequenceNumber}: {title}!
                </motion.p>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-center gap-3 mb-8"
                >
                  <div className="flex items-center gap-1 bg-[var(--color-peach)] text-amber-800 px-4 py-2 rounded-full">
                    <Trophy className="w-5 h-5" />
                    <span className="font-medium">Mission Complete!</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <Link
                    href="/dashboard"
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    <PartyPopper className="w-5 h-5" />
                    Continue Adventure
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mission Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-indigo)] to-[var(--color-violet)] rounded-3xl flex items-center justify-center text-5xl shrink-0 shadow-lg">
              {missionEmojis[sequenceNumber - 1] || "🎯"}
            </div>
            <div>
              <p className="text-[var(--color-violet)] font-medium mb-1">
                Mission {sequenceNumber}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-navy)]">
                {title}
              </h1>
              {isCompleted && (
                <span className="inline-flex items-center gap-1 mt-2 text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  Completed!
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Story Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8 bg-gradient-to-br from-[var(--color-cream)] to-white"
        >
          <div className="flex items-start gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-[var(--color-violet)] shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-bold text-[var(--color-navy)] mb-2">
                The Story So Far...
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">{storyIntro}</p>
            </div>
          </div>
        </motion.div>

        {/* Goal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mb-8 bg-[var(--color-peach)]"
        >
          <h2 className="text-lg font-bold text-amber-900 mb-2">🎯 Your Goal</h2>
          <p className="text-amber-800 text-lg">{goal}</p>
        </motion.div>

        {/* Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card mb-8"
        >
          <h2 className="text-lg font-bold text-[var(--color-navy)] mb-6">
            ✅ Steps to Complete
          </h2>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.button
                key={index}
                onClick={() => toggleStep(index)}
                disabled={isCompleted}
                className={`w-full flex items-start gap-4 p-4 rounded-xl text-left transition-all ${
                  checkedSteps[index]
                    ? "bg-green-50"
                    : "bg-gray-50 hover:bg-gray-100"
                } ${isCompleted ? "cursor-default" : "cursor-pointer"}`}
                whileTap={isCompleted ? {} : { scale: 0.98 }}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    checkedSteps[index]
                      ? "bg-green-500 text-white"
                      : "bg-white border-2 border-gray-300"
                  }`}
                >
                  {checkedSteps[index] ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-bold text-gray-400">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1 pt-1">
                  <p
                    className={`text-base ${
                      checkedSteps[index]
                        ? "text-green-700 line-through"
                        : "text-[var(--color-navy)]"
                    }`}
                  >
                    {step}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Resources */}
        {resources && resources.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card mb-8"
          >
            <h2 className="text-lg font-bold text-[var(--color-navy)] mb-4">
              📚 Helpful Resources
            </h2>
            <ul className="space-y-2">
              {resources.map((resource, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-[var(--color-violet)] hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {resource}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Completion Button */}
        {!isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="sticky bottom-6 space-y-3"
          >
            {/* Quick complete button for testing */}
            {!allChecked && (
              <button
                onClick={handleComplete}
                disabled={isCompleting}
                className="w-full py-3 px-8 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all bg-violet-500 text-white hover:bg-violet-600 shadow-md"
              >
                {isCompleting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Completing...
                  </>
                ) : (
                  <>
                    <Trophy className="w-5 h-5" />
                    Complete Mission (Skip Steps)
                  </>
                )}
              </button>
            )}
            
            {/* Normal complete button */}
            <button
              onClick={handleComplete}
              disabled={!allChecked || isCompleting}
              className={`w-full py-4 px-8 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                allChecked
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isCompleting ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Completing...
                </>
              ) : allChecked ? (
                <>
                  <Trophy className="w-6 h-6" />
                  Complete Mission!
                </>
              ) : (
                <>
                  <Circle className="w-6 h-6" />
                  Check off all steps to complete
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* Already completed state */}
        {isCompleted && !showCelebration && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card bg-green-50 text-center"
          >
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-green-800 mb-2">
              Mission Completed!
            </h3>
            <p className="text-green-700 mb-6">
              Great work on this mission. Ready for the next adventure?
            </p>
            <Link href="/dashboard" className="btn-primary inline-block">
              Back to Dashboard
            </Link>
          </motion.div>
        )}
      </main>
    </div>
  );
}

