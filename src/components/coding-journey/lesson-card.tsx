"use client";

import { motion } from "framer-motion";
import { Check, Lock, Play, Star, BookOpen } from "lucide-react";
import { PersonalizedLesson } from "@/lib/code-generator/lesson-scaffolder";

interface LessonCardProps {
  lesson: PersonalizedLesson;
  index: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  completedSteps: number;
  totalSteps: number;
  earnedXp: number;
  onClick: () => void;
}

export function LessonCard({
  lesson,
  index,
  isUnlocked,
  isCompleted,
  completedSteps,
  totalSteps,
  earnedXp,
  onClick,
}: LessonCardProps) {
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
  
  // Phase colors
  const phaseColors = {
    1: { bg: 'from-emerald-500 to-teal-600', icon: '👋' },
    2: { bg: 'from-blue-500 to-indigo-600', icon: '📦' },
    3: { bg: 'from-violet-500 to-purple-600', icon: '🔄' },
    4: { bg: 'from-orange-500 to-red-600', icon: '🔧' },
    5: { bg: 'from-pink-500 to-rose-600', icon: '🚀' },
  };
  
  const colors = phaseColors[lesson.phase] || phaseColors[1];

  return (
    <motion.button
      onClick={onClick}
      disabled={!isUnlocked}
      whileHover={isUnlocked ? { scale: 1.02, y: -4 } : {}}
      whileTap={isUnlocked ? { scale: 0.98 } : {}}
      className={`relative w-full text-left rounded-2xl overflow-hidden transition-all ${
        isUnlocked 
          ? 'cursor-pointer' 
          : 'cursor-not-allowed opacity-60'
      }`}
    >
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-10`} />
      
      {/* Card content */}
      <div className="relative bg-slate-800/90 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
        {/* Top row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Lesson number/icon */}
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center text-2xl shadow-lg`}>
              {isCompleted ? (
                <Check className="w-6 h-6 text-white" />
              ) : !isUnlocked ? (
                <Lock className="w-5 h-5 text-white/70" />
              ) : (
                colors.icon
              )}
            </div>
            
            <div>
              <p className="text-white/50 text-xs font-medium uppercase tracking-wide">
                Lesson {index + 1}
              </p>
              <h3 className="text-white font-bold text-lg">{lesson.title}</h3>
            </div>
          </div>

          {/* XP badge */}
          {isCompleted ? (
            <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
              <Star className="w-4 h-4" />
              <span className="text-sm font-bold">{earnedXp} XP</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-white/10 text-white/50 px-3 py-1 rounded-full">
              <Star className="w-4 h-4" />
              <span className="text-sm">{lesson.totalXp} XP</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-white/60 text-sm mb-4">{lesson.description}</p>

        {/* Concepts */}
        <div className="flex flex-wrap gap-2 mb-4">
          {lesson.concepts.map((concept) => (
            <span
              key={concept}
              className="text-xs px-2 py-1 rounded-full bg-white/5 text-white/50 border border-white/10"
            >
              {concept}
            </span>
          ))}
        </div>

        {/* Progress bar */}
        {isUnlocked && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/50">
                {completedSteps}/{totalSteps} steps
              </span>
              <span className="text-white/50">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${colors.bg}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>
          </div>
        )}

        {/* CTA */}
        {isUnlocked && !isCompleted && (
          <div className="mt-4 flex items-center justify-end">
            <div className={`flex items-center gap-2 bg-gradient-to-r ${colors.bg} text-white px-4 py-2 rounded-xl font-medium text-sm`}>
              <Play className="w-4 h-4" />
              {completedSteps > 0 ? 'Continue' : 'Start'}
            </div>
          </div>
        )}

        {isCompleted && (
          <div className="mt-4 flex items-center justify-end">
            <div className="flex items-center gap-2 bg-white/10 text-white/70 px-4 py-2 rounded-xl font-medium text-sm">
              <BookOpen className="w-4 h-4" />
              Review
            </div>
          </div>
        )}
      </div>

      {/* Locked overlay */}
      {!isUnlocked && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
          <div className="text-center">
            <Lock className="w-8 h-8 text-white/30 mx-auto mb-2" />
            <p className="text-white/40 text-sm">Complete previous lessons</p>
          </div>
        </div>
      )}
    </motion.button>
  );
}



