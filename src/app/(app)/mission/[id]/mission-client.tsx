"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  Loader2,
  Trophy,
  PartyPopper,
  Sparkles,
} from "lucide-react";
import { Confetti } from "@/components/confetti";
import { PyodideLoader, LessonStep, type LessonStepData } from "@/components/code-editor";

interface MissionClientProps {
  missionId: string;
  sequenceNumber: number;
  title: string;
  storyIntro: string;
  goal: string;
  steps: LessonStepData[];
  estimatedDuration: number;
  resources: string[] | null;
  isCompleted: boolean;
  childName: string;
  currentStep: number;
  savedCodeProgress: Record<string, string> | null;
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
  currentStep: initialStep,
  savedCodeProgress,
}: MissionClientProps) {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(() => {
    // Mark steps as completed if we've progressed past them
    const completed = new Set<number>();
    for (let i = 0; i < initialStep; i++) {
      completed.add(i);
    }
    return completed;
  });
  const [codeProgress, setCodeProgress] = useState<Record<string, string>>(
    savedCodeProgress || {}
  );
  const [isCompleting, setIsCompleting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  // Temporarily skip intro for debugging
  const [showIntro, setShowIntro] = useState(false);
  // const [showIntro, setShowIntro] = useState(!initialCompleted && initialStep === 0);
  const [isSaving, setIsSaving] = useState(false);

  // Safety check for steps
  const safeSteps = Array.isArray(steps) ? steps : [];
  const currentStep = safeSteps[currentStepIndex];
  
  // Debug - remove after testing
  console.log("Mission data:", { 
    missionId, 
    title, 
    stepsCount: safeSteps.length, 
    currentStepIndex,
    showIntro,
    initialCompleted,
    initialStep,
    currentStep: currentStep?.title 
  });
  
  // Fallback if no steps
  if (safeSteps.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-2xl mb-4">⚠️</p>
          <p className="text-gray-600">Mission content is loading...</p>
          <p className="text-gray-400 text-sm mt-2">If this persists, try refreshing the page.</p>
        </div>
      </div>
    );
  }

  // Save progress to server
  const saveProgress = useCallback(async (stepIndex: number, code?: string) => {
    setIsSaving(true);
    try {
      await fetch(`/api/missions/${missionId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentStep: stepIndex,
          codeProgress: code ? { ...codeProgress, [stepIndex]: code } : codeProgress,
        }),
      });
    } catch (error) {
      console.error("Failed to save progress:", error);
    } finally {
      setIsSaving(false);
    }
  }, [missionId, codeProgress]);

  const handleStepComplete = () => {
    setCompletedSteps(prev => new Set(prev).add(currentStepIndex));
  };

  const handleCodeChange = (code: string) => {
    setCodeProgress(prev => ({
      ...prev,
      [currentStepIndex]: code,
    }));
  };

  const goToNextStep = () => {
    if (currentStepIndex < safeSteps.length - 1) {
      // Not the last step - go to next
      const nextStep = currentStepIndex + 1;
      setCurrentStepIndex(nextStep);
      setCompletedSteps(prev => new Set(prev).add(currentStepIndex));
      saveProgress(nextStep);
    } else {
      // Last step - mark it complete and finish the mission
      // The button being enabled means they can proceed (either non-code step or code completed)
      setCompletedSteps(prev => new Set(prev).add(currentStepIndex));
      handleCompleteMission();
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleCompleteMission = async () => {
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

  const startMission = () => {
    setShowIntro(false);
  };

  // Show intro screen
  if (showIntro) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)]">
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

        <main className="max-w-4xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* Mission Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-32 h-32 bg-gradient-to-br from-[var(--color-indigo)] to-[var(--color-violet)] rounded-3xl flex items-center justify-center text-7xl mx-auto mb-8 shadow-xl"
            >
              {missionEmojis[sequenceNumber - 1] || "🎯"}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-[var(--color-violet)] font-semibold text-lg mb-2"
            >
              Mission {sequenceNumber}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-5xl font-bold text-[var(--color-navy)] mb-6"
            >
              {title}
            </motion.h1>

            {/* Story Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card max-w-2xl mx-auto mb-8 text-left"
            >
              <div className="flex items-start gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-[var(--color-violet)] shrink-0" />
                <h2 className="font-bold text-[var(--color-navy)]">The Story</h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">{storyIntro}</p>
            </motion.div>

            {/* Goal Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="card max-w-2xl mx-auto mb-8 bg-[var(--color-peach)] text-left"
            >
              <h2 className="font-bold text-amber-900 mb-2">🎯 Your Mission</h2>
              <p className="text-amber-800 text-lg">{goal}</p>
            </motion.div>

            {/* Start Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              onClick={startMission}
              className="btn-primary text-lg px-10 py-4"
            >
              Start Mission 🚀
            </motion.button>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <PyodideLoader>
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
              <span className="font-medium">Dashboard</span>
            </Link>

            <div className="flex items-center gap-3">
              {isSaving && (
                <span className="text-sm text-gray-400 flex items-center gap-1">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </span>
              )}
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Mission {sequenceNumber}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="text-sm font-medium text-[var(--color-navy)]">{title}</span>
              </div>
              
              {isCompleted && (
                <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full text-sm">
                  <CheckCircle className="w-4 h-4" />
                </span>
              )}
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
                  >
                    <Link
                      href="/dashboard"
                      className="btn-primary flex items-center justify-center gap-2"
                    >
                      <PartyPopper className="w-5 h-5" />
                      Continue Adventure
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Current Lesson Step */}
          {currentStep ? (
            <LessonStep
              step={currentStep}
              stepNumber={currentStepIndex + 1}
              totalSteps={safeSteps.length}
              isCompleted={completedSteps.has(currentStepIndex)}
              savedCode={codeProgress[currentStepIndex]}
              onCodeChange={handleCodeChange}
              onComplete={handleStepComplete}
              onPrevious={currentStepIndex > 0 ? goToPreviousStep : undefined}
              onNext={goToNextStep}
              canGoNext={isCompleted || completedSteps.has(currentStepIndex)}
            />
          ) : (
            <div className="card text-center p-8">
              <p className="text-gray-500">Loading lesson content...</p>
            </div>
          )}

          {/* Already completed state */}
          {isCompleted && !showCelebration && currentStepIndex === safeSteps.length - 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-green-50 text-center mt-8"
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
    </PyodideLoader>
  );
}
