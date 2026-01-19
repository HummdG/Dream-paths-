"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Zap, Shield, Sparkles, Star } from "lucide-react";

interface HeroPreviewProps {
  heroName?: string;
  health?: number;
  speed?: number;
  color?: string;
  showStats?: boolean;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

const heroEmojis = ["🦸", "🦸‍♀️", "🦹", "🦹‍♀️", "🧙", "🧙‍♀️", "🧝", "🧝‍♀️", "🐱‍👤", "🥷"];
const heroColors: Record<string, string> = {
  red: "from-red-400 to-red-600",
  blue: "from-blue-400 to-blue-600",
  green: "from-green-400 to-green-600",
  purple: "from-purple-400 to-purple-600",
  orange: "from-orange-400 to-orange-600",
  pink: "from-pink-400 to-pink-600",
  yellow: "from-yellow-400 to-yellow-600",
  cyan: "from-cyan-400 to-cyan-600",
};

export function HeroPreview({
  heroName = "Hero",
  health = 100,
  speed = 5,
  color = "blue",
  showStats = true,
  size = "md",
  animate = true,
}: HeroPreviewProps) {
  const [sparkle, setSparkle] = useState(false);
  const [heroEmoji] = useState(() => heroEmojis[Math.floor(Math.random() * heroEmojis.length)]);

  useEffect(() => {
    if (animate) {
      const interval = setInterval(() => {
        setSparkle(true);
        setTimeout(() => setSparkle(false), 500);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [animate]);

  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-32 h-32",
    lg: "w-40 h-40",
  };

  const textSizes = {
    sm: "text-3xl",
    md: "text-5xl",
    lg: "text-6xl",
  };

  const gradientColor = heroColors[color.toLowerCase()] || heroColors.blue;

  // Calculate health bar color based on health level
  const healthColor = health > 70 ? "bg-green-500" : health > 30 ? "bg-yellow-500" : "bg-red-500";
  const healthWidth = Math.min(100, Math.max(0, health));

  return (
    <div className="relative flex flex-col items-center p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl border-4 border-dashed border-purple-200">
      {/* Floating stars background */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-300"
            initial={{ opacity: 0.3 }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [0.8, 1.2, 0.8],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              delay: i * 0.4,
              repeat: Infinity,
            }}
            style={{
              left: `${15 + i * 18}%`,
              top: `${10 + (i % 3) * 20}%`,
            }}
          >
            <Star className="w-4 h-4 fill-current" />
          </motion.div>
        ))}
      </div>

      {/* Hero Character */}
      <div className="relative">
        {/* Sparkle effect */}
        <AnimatePresence>
          {sparkle && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              className="absolute -top-2 -right-2 text-yellow-400"
            >
              <Sparkles className="w-8 h-8" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero avatar */}
        <motion.div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${gradientColor} flex items-center justify-center shadow-xl border-4 border-white`}
          animate={animate ? {
            y: [0, -8, 0],
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span className={textSizes[size]}>{heroEmoji}</span>
        </motion.div>

        {/* Speed indicator (lightning bolts) */}
        {speed > 0 && (
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
            {[...Array(Math.min(5, Math.ceil(speed / 2)))].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.4, x: -5 }}
                animate={{ opacity: [0.4, 1, 0.4], x: [-5, 0, -5] }}
                transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
              >
                <Zap className="w-4 h-4 text-yellow-500 fill-yellow-400" />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Hero Name Badge */}
      <motion.div
        className="mt-4 px-4 py-2 bg-white rounded-full shadow-lg border-2 border-purple-200"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring" }}
      >
        <span className="font-bold text-purple-700 text-lg tracking-wide">
          {heroName}
        </span>
      </motion.div>

      {/* Stats Display */}
      {showStats && (
        <div className="mt-4 w-full max-w-xs space-y-3">
          {/* Health Bar */}
          <div className="bg-white rounded-xl p-3 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <span className="font-bold text-gray-700">Health</span>
              <span className="ml-auto font-bold text-lg text-red-600">{health}</span>
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${healthColor} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${healthWidth}%` }}
                transition={{ type: "spring", stiffness: 100 }}
              />
            </div>
          </div>

          {/* Speed Display */}
          <div className="bg-white rounded-xl p-3 shadow-md">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500 fill-yellow-400" />
              <span className="font-bold text-gray-700">Speed</span>
              <div className="ml-auto flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: i < speed ? 1 : 0.5 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Zap 
                      className={`w-4 h-4 ${i < speed ? 'text-yellow-500 fill-yellow-400' : 'text-gray-300'}`} 
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* "Your Creation!" label */}
      <div className="mt-4 flex items-center gap-2 text-purple-600">
        <Sparkles className="w-4 h-4" />
        <span className="text-sm font-medium">Your Creation!</span>
        <Sparkles className="w-4 h-4" />
      </div>
    </div>
  );
}

// Simple output bubble for print statements
export function OutputBubble({ message, delay = 0 }: { message: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: "spring" }}
      className="relative bg-white rounded-2xl px-4 py-3 shadow-lg border-2 border-green-200 max-w-sm"
    >
      {/* Speech bubble tail */}
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-l-2 border-b-2 border-green-200 rotate-45" />
      
      <p className="text-gray-800 font-medium relative z-10">{message}</p>
    </motion.div>
  );
}

// Animated code result display for kids
export function CodeResultDisplay({ 
  output, 
  isCorrect,
  celebration = true 
}: { 
  output: string; 
  isCorrect: boolean;
  celebration?: boolean;
}) {
  const lines = output.split('\n').filter(Boolean);

  return (
    <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 overflow-hidden">
      {/* Celebration overlay */}
      {isCorrect && celebration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20"
        />
      )}

      {/* Output lines */}
      <div className="space-y-2 relative z-10">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className="flex items-center gap-3"
          >
            <span className="text-green-400 text-lg">→</span>
            <span className="text-white font-mono text-lg">{line}</span>
          </motion.div>
        ))}
      </div>

      {/* Success message */}
      {isCorrect && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: lines.length * 0.15 + 0.3 }}
          className="mt-4 flex items-center gap-2 text-green-400 font-bold"
        >
          <span className="text-2xl">🎉</span>
          <span>Perfect! You did it!</span>
          <span className="text-2xl">🎉</span>
        </motion.div>
      )}
    </div>
  );
}

