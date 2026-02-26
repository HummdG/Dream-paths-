"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PlatformerEngine } from "@/lib/game-engine";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Trophy,
  Zap,
  Gamepad2,
  BookOpen,
} from "lucide-react";
import { SimpleEditor } from "@/components/code-editor/simple-editor";
import { GamePreview } from "./game-preview";
import { LessonStep, PersonalizedLesson } from "@/lib/code-generator/lesson-scaffolder";
import { 
  calculateLevel, 
  getCelebrationLevel, 
  calculateXpWithBonuses,
  getLevelTitle,
} from "@/lib/gamification/rewards";
import { LevelData } from "@/components/level-designer/level-designer";
import { PYTHON_GAME_API } from "@/lib/game-engine/python-api";
import confetti from "canvas-confetti";

interface CodingWorkspaceProps {
  lesson: PersonalizedLesson;
  levelData: LevelData;
  heroPixels?: string[][];
  currentStepIndex: number;
  completedSteps: string[];
  totalXp: number;
  streak: number;
  onStepComplete: (stepId: string, earnedXp: number) => void;
  onNextStep: () => void;
  onPreviousStep: () => void;
  onBackToLessons: () => void;
}

export function CodingWorkspace({
  lesson,
  levelData,
  heroPixels,
  currentStepIndex,
  completedSteps,
  totalXp,
  streak,
  onStepComplete,
  onNextStep,
  onPreviousStep,
  onBackToLessons,
}: CodingWorkspaceProps) {
  const currentStep = lesson.steps[currentStepIndex];
  const isStepCompleted = completedSteps.includes(currentStep.id);
  
  const [currentCode, setCurrentCode] = useState(currentStep.starterCode);
  const [currentOutput, setCurrentOutput] = useState("");
  const [hintLevel, setHintLevel] = useState(0);
  const [hasRunCode, setHasRunCode] = useState(false);
  const [stepJustCompleted, setStepJustCompleted] = useState(false);
  const [showXpGain, setShowXpGain] = useState(false);
  const [earnedXpDisplay, setEarnedXpDisplay] = useState({ total: 0, bonuses: [] as Array<{ name: string; amount: number }> });
  const [engine, setEngine] = useState<PlatformerEngine | null>(null);
  
  const gameCanvasRef = useRef<HTMLDivElement>(null);
  
  // Reset state when step changes
  useEffect(() => {
    setCurrentCode(currentStep.starterCode);
    setCurrentOutput("");
    setHintLevel(0);
    setHasRunCode(false);
    setStepJustCompleted(false);
  }, [currentStep.id, currentStep.starterCode]);

  // Trigger confetti based on celebration level
  const celebrate = useCallback((level: 'small' | 'medium' | 'large' | 'epic') => {
    const configs = {
      small: { particleCount: 30, spread: 40 },
      medium: { particleCount: 60, spread: 60 },
      large: { particleCount: 100, spread: 80 },
      epic: { particleCount: 200, spread: 120, startVelocity: 45 },
    };
    
    const config = configs[level];
    confetti({
      ...config,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#06b6d4', '#fbbf24', '#ec4899'],
    });
    
    if (level === 'epic') {
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#8b5cf6', '#06b6d4'],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#fbbf24', '#ec4899'],
        });
      }, 200);
    }
  }, []);

  // Validate code against step requirements
  const validateCode = useCallback((code: string, output: string, validation: LessonStep['validation']): boolean => {
    for (const rule of validation) {
      switch (rule.type) {
        case 'contains':
          if (!code.includes(rule.value)) return false;
          break;
        case 'calls_function':
          const funcCallRegex = new RegExp(`${rule.value}\\s*\\(`);
          if (!funcCallRegex.test(code)) return false;
          break;
        case 'output_contains':
          if (!output.includes(rule.value)) return false;
          break;
        case 'runs_without_error':
          if (output.startsWith('❌')) return false;
          break;
      }
    }
    return true;
  }, []);

  // Handle step completion
  const handleStepComplete = useCallback(() => {
    if (isStepCompleted) return;
    
    setStepJustCompleted(true);
    
    // Calculate XP with bonuses
    const noHintsUsed = hintLevel === 0;
    const { totalXp: earned, bonuses } = calculateXpWithBonuses(
      currentStep.rewards.xp,
      streak,
      noHintsUsed
    );
    
    setEarnedXpDisplay({ total: earned, bonuses });
    setShowXpGain(true);
    
    // Trigger appropriate celebration
    const celebrationLevel = getCelebrationLevel(
      currentStep.rewards.badge ? 'badge_earned' : 'step_complete'
    );
    celebrate(celebrationLevel);
    
    // Notify parent component
    onStepComplete(currentStep.id, earned);
    
    // Hide XP display after animation
    setTimeout(() => {
      setShowXpGain(false);
    }, 3000);
  }, [isStepCompleted, hintLevel, currentStep, streak, celebrate, onStepComplete]);

  // Run code handler for SimpleEditor
  const handleRunCode = useCallback(async (code: string): Promise<{ output: string; error?: string; success?: boolean }> => {
    setCurrentCode(code);
    setHasRunCode(true);
    
    try {
      // Start the game engine first so code can control it
      if (engine) {
        engine.start();
      }
      
      // Small delay to ensure engine is running
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const win = window as unknown as { pyodide?: { globals: { get: (key: string) => unknown; set: (key: string, val: unknown) => void }; runPythonAsync: (code: string) => Promise<string> } };
      if (typeof win.pyodide === "undefined") {
        return { output: "", error: "Python is loading... Try again in a moment!" };
      }

      const pyodide = win.pyodide;
      
      // Load the game API once, then reset state on subsequent runs
      const apiLoaded = pyodide.globals.get('__game_api_loaded__');
      if (!apiLoaded) {
        await pyodide.runPythonAsync(PYTHON_GAME_API);
        pyodide.globals.set('__game_api_loaded__', true);
      } else {
        // Reset Python globals and clear engine callbacks/events for a clean run
        await pyodide.runPythonAsync('_reset_game_state()');
      }

      // Reset JS engine state as well (in case Python-side reset missed anything)
      const windowEngine = (window as unknown as { gameEngine?: PlatformerEngine }).gameEngine;
      if (windowEngine) {
        windowEngine.clearCallbacks();
        windowEngine.clearEvents();
      }
      
      const wrappedCode = `
import sys
from io import StringIO

__old_stdout__ = sys.stdout
sys.stdout = StringIO()

try:
${code.split("\n").map(line => "    " + line).join("\n")}
except Exception as e:
    print(f"Error: {e}")

__captured_output__ = sys.stdout.getvalue()
sys.stdout = __old_stdout__
__captured_output__
`;
      
      const result = await pyodide.runPythonAsync(wrappedCode);
      const printOutput = (result || "").trim();
      
      setCurrentOutput(printOutput);
      
      // Check if step is completed
      if (!isStepCompleted) {
        const isValid = validateCode(code, printOutput, currentStep.validation);
        if (isValid) {
          handleStepComplete();
          return { output: printOutput, success: true };
        }
      }
      
      // Small celebration for successful run
      celebrate('small');
      
      return { output: printOutput };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong!";
      const friendlyError = errorMessage
        .replace(/SyntaxError:/g, "Oops! Check your code:")
        .replace(/NameError:/g, "Hmm, I don't know:")
        .replace(/TypeError:/g, "Something doesn't match:")
        .replace(/IndentationError:/g, "Check your spacing:");
      return { output: "", error: friendlyError };
    }
  }, [isStepCompleted, currentStep, celebrate, validateCode, handleStepComplete, engine]);

  // Calculate progress
  const stepProgress = ((currentStepIndex + 1) / lesson.steps.length) * 100;
  const { level } = calculateLevel(totalXp);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Back & Lesson Info */}
            <div className="flex items-center gap-4">
              <button
                onClick={onBackToLessons}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Lessons</span>
              </button>
              
              <div className="h-6 w-px bg-white/20" />
              
              <div className="flex items-center gap-2">
                <span className="text-2xl">{lesson.title.split(' ')[0]}</span>
                <div>
                  <h1 className="text-white font-bold">{lesson.title.substring(2)}</h1>
                  <p className="text-white/50 text-xs">Step {currentStepIndex + 1} of {lesson.steps.length}</p>
                </div>
              </div>
            </div>

            {/* Center: Progress */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-bold">{totalXp} XP</span>
              </div>
              
              {streak > 0 && (
                <div className="flex items-center gap-2 bg-orange-500/20 rounded-full px-3 py-1.5">
                  <span className="text-orange-400">🔥</span>
                  <span className="text-orange-300 font-bold">{streak} day streak</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 bg-violet-500/20 rounded-full px-3 py-1.5">
                <Trophy className="w-4 h-4 text-violet-400" />
                <span className="text-violet-300 font-bold">Level {level}</span>
                <span className="text-violet-400/70 text-xs">{getLevelTitle(level)}</span>
              </div>
            </div>

            {/* Right: Step Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={onPreviousStep}
                disabled={currentStepIndex === 0}
                className="p-2 rounded-lg bg-white/10 text-white/70 hover:text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {/* Step dots */}
              <div className="flex gap-1.5 px-2">
                {lesson.steps.map((step, idx) => (
                  <div
                    key={step.id}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      completedSteps.includes(step.id)
                        ? 'bg-green-400'
                        : idx === currentStepIndex
                        ? 'bg-violet-400 scale-125'
                        : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={onNextStep}
                disabled={currentStepIndex === lesson.steps.length - 1}
                className="p-2 rounded-lg bg-white/10 text-white/70 hover:text-white hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: `${stepProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto p-4">
        <div className="grid lg:grid-cols-2 gap-4 h-[calc(100vh-140px)]">
          {/* Left Side: Instructions + Code Editor - Gets more space on mobile */}
          <div className="flex flex-col gap-3 min-h-[60vh] lg:min-h-0">
            {/* Step Instructions - Compact */}
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-white/10 shrink-0"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-violet-400" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-base">{currentStep.title}</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-violet-400 bg-violet-500/20 px-2 py-0.5 rounded-full">
                        +{currentStep.rewards.xp} XP
                      </span>
                      {currentStep.rewards.badge && (
                        <span className="text-xs text-yellow-400 bg-yellow-500/20 px-2 py-0.5 rounded-full">
                          🏆 {currentStep.rewards.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {isStepCompleted && (
                  <div className="flex items-center gap-1 bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                    <Check className="w-3 h-3" />
                    <span className="text-xs font-medium">Done</span>
                  </div>
                )}
              </div>

              <p className="text-white/80 text-sm mb-2">{currentStep.instruction}</p>
              
              <div className="bg-black/20 rounded-lg p-2 border border-white/5">
                <p className="text-white/60 text-xs leading-relaxed">{currentStep.explanation}</p>
              </div>
            </motion.div>

            {/* Simple Code Editor */}
            <div className="flex-1 min-h-0">
              <SimpleEditor
                initialCode={currentStep.starterCode}
                hint={currentStep.hints[hintLevel]}
                onRun={handleRunCode}
                onCodeChange={setCurrentCode}
                height="380px"
                showGameHint
              />
            </div>
          </div>

          {/* Right Side: Game Preview - Smaller on mobile */}
          <div className="flex flex-col gap-2 min-h-[35vh] lg:min-h-0">
            <div className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-cyan-400" />
              <span className="text-white/70 text-sm font-medium">Your Game: {levelData.name}</span>
              <span className="text-white/40 text-xs ml-auto">Changes appear instantly!</span>
            </div>

            <div 
              ref={gameCanvasRef}
              className="flex-1 rounded-xl overflow-hidden border border-white/10 bg-slate-950 min-h-[200px]"
            >
              <GamePreview
                levelData={levelData}
                heroPixels={heroPixels}
                isPlaying={hasRunCode}
                onEngineReady={(e) => setEngine(e)}
              />
            </div>

            {/* Game Tips - Compact */}
            <div className="bg-slate-800/50 rounded-lg px-3 py-2 border border-white/5 shrink-0">
              <div className="flex items-center gap-4 text-xs text-white/50">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-violet-400" />
                  <span className="text-white/40">Tips:</span>
                </span>
                <span><code className="text-green-400">print()</code> = speech bubble</span>
                <span><code className="text-cyan-400">move()</code> = move character</span>
                <span><code className="text-yellow-400">jump()</code> = jump!</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* XP Gain Animation */}
      <AnimatePresence>
        {showXpGain && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-violet-600 to-cyan-600 rounded-2xl px-6 py-4 shadow-2xl border border-white/20">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="text-4xl mb-2"
                >
                  🎉
                </motion.div>
                <p className="text-white font-bold text-xl mb-1">
                  +{earnedXpDisplay.total} XP!
                </p>
                {earnedXpDisplay.bonuses.length > 0 && (
                  <div className="flex flex-col gap-1">
                    {earnedXpDisplay.bonuses.map((bonus, i) => (
                      <span key={i} className="text-cyan-300 text-sm">
                        +{bonus.amount} {bonus.name}
                      </span>
                    ))}
                  </div>
                )}
                {currentStep.rewards.badge && (
                  <div className="mt-2 bg-yellow-500/20 rounded-full px-3 py-1 inline-flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-300 text-sm font-medium">
                      {currentStep.rewards.badge}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step Complete - Next Step Prompt */}
      <AnimatePresence>
        {stepJustCompleted && isStepCompleted && currentStepIndex < lesson.steps.length - 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-40"
            onClick={() => setStepJustCompleted(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 max-w-md mx-4 border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🚀</div>
                <h2 className="text-2xl font-bold text-white mb-2">Awesome Work!</h2>
                <p className="text-white/60 mb-6">
                  You completed "{currentStep.title}"! Ready for the next challenge?
                </p>
                
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setStepJustCompleted(false)}
                    className="px-4 py-2 rounded-xl bg-white/10 text-white/70 hover:bg-white/20 transition-all"
                  >
                    Keep Practicing
                  </button>
                  <button
                    onClick={() => {
                      setStepJustCompleted(false);
                      onNextStep();
                    }}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-bold hover:scale-105 transition-all flex items-center gap-2"
                  >
                    Next Step
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

