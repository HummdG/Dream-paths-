"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Gamepad2,
  Trophy,
  Zap,
  ArrowLeft,
  Sparkles,
  Target,
  BookOpen,
  Play,
  Star,
  Flame,
} from "lucide-react";
import { LessonCard } from "./lesson-card";
import { CodingWorkspace } from "./coding-workspace";
import { LevelData } from "@/components/level-designer/level-designer";
import { 
  generateLessonsForLevel, 
  PersonalizedLesson,
  calculateLessonProgress 
} from "@/lib/code-generator/lesson-scaffolder";
import {
  calculateLevel,
  getLevelTitle,
  checkStreak,
  BADGES,
  Badge,
  createInitialProgress,
  PlayerProgress,
} from "@/lib/gamification/rewards";

interface CodingJourneyPageProps {
  levelData: LevelData;
  childName: string;
  heroName?: string;
  heroPixels?: string[][];
  initialProgress?: {
    completedSteps: string[];
    totalXp: number;
    streak: number;
    badges: string[];
    lastActiveDate?: string;
  };
  onProgressUpdate?: (progress: {
    completedSteps: string[];
    totalXp: number;
    streak: number;
    badges: string[];
  }) => void;
  onBack?: () => void;
}

export function CodingJourneyPage({
  levelData,
  childName,
  heroName = "Hero",
  heroPixels,
  initialProgress,
  onProgressUpdate,
  onBack,
}: CodingJourneyPageProps) {
  // View state
  const [view, setView] = useState<'lessons' | 'coding'>('lessons');
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Progress state
  const [completedSteps, setCompletedSteps] = useState<string[]>(
    initialProgress?.completedSteps || []
  );
  const [totalXp, setTotalXp] = useState(initialProgress?.totalXp || 0);
  const [streak, setStreak] = useState(initialProgress?.streak || 0);
  const [earnedBadges, setEarnedBadges] = useState<string[]>(
    initialProgress?.badges || []
  );

  // Generate personalized lessons
  const lessons = useMemo(
    () => generateLessonsForLevel(levelData, childName, heroName),
    [levelData, childName, heroName]
  );

  // Calculate overall progress
  const overallProgress = useMemo(
    () => calculateLessonProgress(lessons, completedSteps),
    [lessons, completedSteps]
  );

  // Calculate level info
  const levelInfo = useMemo(() => calculateLevel(totalXp), [totalXp]);

  // Check and update streak on mount
  useEffect(() => {
    const { shouldIncrement, shouldReset } = checkStreak(
      initialProgress?.lastActiveDate || null
    );
    
    if (shouldReset) {
      setStreak(1); // Reset but count today
    } else if (shouldIncrement) {
      setStreak((s) => s + 1);
    }
  }, [initialProgress?.lastActiveDate]);

  // Save progress when it changes
  useEffect(() => {
    onProgressUpdate?.({
      completedSteps,
      totalXp,
      streak,
      badges: earnedBadges,
    });
  }, [completedSteps, totalXp, streak, earnedBadges, onProgressUpdate]);

  // Get completed steps per lesson
  const getLessonCompletedSteps = (lesson: PersonalizedLesson) => {
    return lesson.steps.filter((s) => completedSteps.includes(s.id)).length;
  };

  // Get earned XP for a lesson
  const getLessonEarnedXp = (lesson: PersonalizedLesson) => {
    return lesson.steps
      .filter((s) => completedSteps.includes(s.id))
      .reduce((sum, s) => sum + s.rewards.xp, 0);
  };

  // Check if lesson is unlocked (previous lesson completed or it's first)
  const isLessonUnlocked = (index: number) => {
    if (index === 0) return true;
    const prevLesson = lessons[index - 1];
    const prevCompleted = prevLesson.steps.every((s) =>
      completedSteps.includes(s.id)
    );
    return prevCompleted;
  };

  // Check if lesson is completed
  const isLessonCompleted = (lesson: PersonalizedLesson) => {
    return lesson.steps.every((s) => completedSteps.includes(s.id));
  };

  // Handle step completion
  const handleStepComplete = (stepId: string, earnedXp: number) => {
    if (completedSteps.includes(stepId)) return;

    setCompletedSteps((prev) => [...prev, stepId]);
    setTotalXp((prev) => prev + earnedXp);

    // Check for badge unlocks
    const step = lessons
      .flatMap((l) => l.steps)
      .find((s) => s.id === stepId);
    if (step?.rewards.badge && !earnedBadges.includes(step.rewards.badge)) {
      setEarnedBadges((prev) => [...prev, step.rewards.badge!]);
    }
  };

  // Navigate steps
  const handleNextStep = () => {
    const currentLesson = lessons[selectedLessonIndex];
    if (currentStepIndex < currentLesson.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else if (selectedLessonIndex < lessons.length - 1) {
      // Move to next lesson
      setSelectedLessonIndex((prev) => prev + 1);
      setCurrentStepIndex(0);
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    } else if (selectedLessonIndex > 0) {
      // Move to previous lesson
      const prevLessonIndex = selectedLessonIndex - 1;
      setSelectedLessonIndex(prevLessonIndex);
      setCurrentStepIndex(lessons[prevLessonIndex].steps.length - 1);
    }
  };

  // Start a lesson
  const startLesson = (index: number) => {
    setSelectedLessonIndex(index);
    // Find first incomplete step
    const lesson = lessons[index];
    const firstIncompleteIndex = lesson.steps.findIndex(
      (s) => !completedSteps.includes(s.id)
    );
    setCurrentStepIndex(firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0);
    setView('coding');
  };

  // If in coding view, show workspace
  if (view === 'coding') {
    return (
      <CodingWorkspace
        lesson={lessons[selectedLessonIndex]}
        levelData={levelData}
        heroPixels={heroPixels}
        currentStepIndex={currentStepIndex}
        completedSteps={completedSteps}
        totalXp={totalXp}
        streak={streak}
        onStepComplete={handleStepComplete}
        onNextStep={handleNextStep}
        onPreviousStep={handlePreviousStep}
        onBackToLessons={() => setView('lessons')}
      />
    );
  }

  // Lessons overview view
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Back & Title */}
            <div className="flex items-center gap-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 rounded-lg bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              
              <div>
                <div className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-violet-400" />
                  <h1 className="text-white font-bold text-xl">Coding Journey</h1>
                </div>
                <p className="text-white/50 text-sm">
                  Learn Python by building "{levelData.name}"
                </p>
              </div>
            </div>

            {/* Right: Stats */}
            <div className="flex items-center gap-3">
              {streak > 0 && (
                <div className="flex items-center gap-2 bg-orange-500/20 rounded-full px-4 py-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <span className="text-orange-300 font-bold">{streak}</span>
                  <span className="text-orange-300/70 text-sm">day streak</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 bg-violet-500/20 rounded-full px-4 py-2">
                <Trophy className="w-5 h-5 text-violet-400" />
                <span className="text-violet-300 font-bold">Lv.{levelInfo.level}</span>
              </div>
              
              <div className="flex items-center gap-2 bg-cyan-500/20 rounded-full px-4 py-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                <span className="text-cyan-300 font-bold">{totalXp}</span>
                <span className="text-cyan-300/70 text-sm">XP</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-violet-600/20 to-cyan-600/20 rounded-3xl p-8 mb-8 border border-white/10"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Hey {childName}! 👋
              </h2>
              <p className="text-white/70 text-lg mb-4">
                Ready to turn your level into real Python code?
              </p>
              
              {/* Progress summary */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-violet-400" />
                  <span className="text-white/70">
                    <span className="text-white font-bold">{overallProgress.completedSteps}</span>
                    /{overallProgress.totalSteps} steps
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-white/70">
                    <span className="text-white font-bold">{overallProgress.earnedXp}</span>
                    /{overallProgress.totalXp} XP
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  <span className="text-white/70">
                    {lessons.filter(l => isLessonCompleted(l)).length}/{lessons.length} lessons
                  </span>
                </div>
              </div>
            </div>

            {/* Level preview */}
            <div className="hidden lg:flex flex-col items-center gap-2">
              <div className="w-48 h-28 rounded-xl bg-slate-800 border border-white/10 overflow-hidden flex items-center justify-center">
                <Gamepad2 className="w-12 h-12 text-white/20" />
              </div>
              <span className="text-white/50 text-sm">{levelData.name}</span>
            </div>
          </div>

          {/* Overall progress bar */}
          <div className="mt-6">
            <div className="h-3 bg-black/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-500 via-cyan-500 to-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress.percentComplete}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <p className="text-white/50 text-sm mt-2 text-right">
              {overallProgress.percentComplete}% complete
            </p>
          </div>
        </motion.div>

        {/* Continue Button */}
        {overallProgress.currentLesson && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <button
              onClick={() => {
                const lessonIndex = lessons.findIndex(
                  (l) => l.id === overallProgress.currentLesson?.id
                );
                if (lessonIndex >= 0) startLesson(lessonIndex);
              }}
              className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 rounded-2xl p-6 text-left transition-all hover:scale-[1.01] group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Continue where you left off</p>
                  <h3 className="text-white font-bold text-xl">
                    {overallProgress.currentLesson.title}
                  </h3>
                  <p className="text-white/60 mt-1">
                    Step: {overallProgress.currentStep?.title}
                  </p>
                </div>
                <div className="bg-white/20 rounded-full p-4 group-hover:bg-white/30 transition-all">
                  <Play className="w-8 h-8 text-white" />
                </div>
              </div>
            </button>
          </motion.div>
        )}

        {/* Lessons Grid */}
        <div className="mb-6">
          <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400" />
            Your Learning Path
          </h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <LessonCard
                lesson={lesson}
                index={index}
                isUnlocked={isLessonUnlocked(index)}
                isCompleted={isLessonCompleted(lesson)}
                completedSteps={getLessonCompletedSteps(lesson)}
                totalSteps={lesson.steps.length}
                earnedXp={getLessonEarnedXp(lesson)}
                onClick={() => isLessonUnlocked(index) && startLesson(index)}
              />
            </motion.div>
          ))}
        </div>

        {/* Badges Section */}
        {earnedBadges.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12"
          >
            <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Your Badges
            </h3>
            
            <div className="flex flex-wrap gap-3">
              {earnedBadges.map((badgeId) => {
                const badge = BADGES.find((b) => b.id === badgeId);
                if (!badge) return null;
                return (
                  <motion.div
                    key={badgeId}
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl px-4 py-3 border border-yellow-500/30 flex items-center gap-3"
                  >
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                      <p className="text-white font-medium">{badge.name}</p>
                      <p className="text-white/50 text-xs">{badge.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}



