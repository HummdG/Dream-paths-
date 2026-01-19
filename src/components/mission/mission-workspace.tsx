"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Play, 
  RotateCcw, 
  Lightbulb, 
  Check, 
  AlertCircle,
  Loader2,
  Star,
  Trophy,
  PartyPopper
} from "lucide-react";
import Link from "next/link";
import { Confetti } from "@/components/confetti";
import { GameCanvas } from "@/components/game-preview/game-canvas";
import { StepPanel } from "@/components/mission/step-panel";
import { Mission, MissionStep } from "@/lib/missions/schema";
import { PlatformerEngine, resetEngine } from "@/lib/game-engine";
import { wrapUserCode } from "@/lib/game-engine/python-api";
import { validateStep, ValidationResult, friendlyError } from "@/lib/validation";
import { CharacterCreator } from "@/components/character-creator";

// Simple syntax highlighting for Python
function highlightPython(code: string): string {
  const keywords = [
    "def", "class", "if", "else", "elif", "for", "while", "return",
    "import", "from", "as", "try", "except", "finally", "with",
    "True", "False", "None", "and", "or", "not", "in", "is",
    "break", "continue", "pass", "lambda", "global", "nonlocal",
  ];
  
  const builtins = [
    "print", "range", "len", "str", "int", "float", "list", "dict",
    "set", "tuple", "input", "abs", "max", "min", "sum", "round",
  ];

  // Game API functions
  const gameAPI = [
    "show_message", "show_score", "show_lives", "set_theme", "set_player_sprite",
    "set_player_position", "get_player_x", "get_player_y", "set_player_x",
    "move", "move_player_y", "set_player_vy", "is_on_ground", "will_collide_below",
    "snap_to_platform", "collides_with", "remove_colliding", "add_platform",
    "load_platform_preset", "add_coin", "add_enemy", "set_enemy_x", "set_enemy_position",
    "add_goal", "play_sound", "you_win", "stop_game", "restart_level",
    "reset_player_position", "freeze_enemies", "unlock_next_level",
    "on_update", "on_key_down", "on_key_up", "is_key_pressed"
  ];

  let result = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  // Highlight strings
  result = result.replace(
    /(["'])((?:\\.|(?!\1)[^\\])*)\1/g,
    '<span class="text-green-400">$&</span>'
  );
  
  // Highlight comments
  result = result.replace(
    /(#.*$)/gm,
    '<span class="text-gray-500 italic">$1</span>'
  );
  
  // Highlight numbers
  result = result.replace(
    /\b(\d+\.?\d*)\b/g,
    '<span class="text-amber-400">$1</span>'
  );
  
  // Highlight keywords
  keywords.forEach(kw => {
    const regex = new RegExp(`\\b(${kw})\\b`, "g");
    result = result.replace(
      regex,
      '<span class="text-violet-400 font-semibold">$1</span>'
    );
  });
  
  // Highlight builtins
  builtins.forEach(fn => {
    const regex = new RegExp(`\\b(${fn})\\b`, "g");
    result = result.replace(
      regex,
      '<span class="text-sky-400">$1</span>'
    );
  });

  // Highlight game API
  gameAPI.forEach(fn => {
    const regex = new RegExp(`\\b(${fn})\\b`, "g");
    result = result.replace(
      regex,
      '<span class="text-pink-400 font-semibold">$1</span>'
    );
  });

  return result;
}

interface MissionWorkspaceProps {
  mission: Mission;
  initialStepIndex?: number;
  childName: string;
  childId: string;
  onStepComplete?: (stepId: string, stars: number, badge?: string) => void;
  onMissionComplete?: (missionId: string) => void;
  heroPixels?: string[][];
  onHeroSaved?: (pixels: string[][]) => void;
}

export function MissionWorkspace({
  mission,
  initialStepIndex = 0,
  childName,
  childId,
  onStepComplete,
  onMissionComplete,
  heroPixels,
  onHeroSaved
}: MissionWorkspaceProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStepIndex);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const [engine, setEngine] = useState<PlatformerEngine | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const currentStep = mission.steps[currentStepIndex];

  // Initialize code when step changes
  useEffect(() => {
    if (currentStep) {
      setCode(currentStep.starterCode);
      setOutput("");
      setError("");
      setValidationResult(null);
      setShowHint(false);
      
      // Reset engine for new step
      const newEngine = resetEngine();
      // Set hero pixels if available
      if (heroPixels) {
        newEngine.setCustomPlayerSprite(heroPixels);
      }
      setEngine(newEngine);
    }
  }, [currentStep, heroPixels]);

  const syncScroll = useCallback(() => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 4;
          textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput("");
    setError("");
    setValidationResult(null);

    try {
      // Reset and reinitialize engine
      const newEngine = resetEngine();
      // Set hero pixels if available
      if (heroPixels) {
        newEngine.setCustomPlayerSprite(heroPixels);
      }
      setEngine(newEngine);
      
      // Wait a bit for engine to initialize
      await new Promise(resolve => setTimeout(resolve, 100));

      // @ts-expect-error - Pyodide is loaded globally
      if (typeof window.pyodide === "undefined") {
        setError("Python is still loading... Please wait a moment and try again!");
        setIsRunning(false);
        return;
      }

      // @ts-expect-error - Pyodide is loaded globally
      const pyodide = window.pyodide;
      
      // Wrap user code with game API
      const wrappedCode = wrapUserCode(code);
      
      // Capture print output
      const runnerCode = `
import sys
from io import StringIO

__old_stdout__ = sys.stdout
sys.stdout = StringIO()

try:
${wrappedCode.split("\n").map(line => "    " + line).join("\n")}
except Exception as e:
    print(f"Error: {e}")

__captured_output__ = sys.stdout.getvalue()
sys.stdout = __old_stdout__
__captured_output__
`;
      
      const result = await pyodide.runPythonAsync(runnerCode);
      const printOutput = result || "";
      
      setOutput(printOutput.trim());
      
      // Start the game engine
      if (newEngine) {
        newEngine.start();
        
        // Wait a bit for events to accumulate
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get events for validation
        const events = newEngine.getEvents();
        
        // Validate the step
        if (currentStep) {
          const validation = validateStep(
            code,
            printOutput,
            events,
            currentStep.validation
          );
          setValidationResult(validation);
          
          // If passed, mark step as complete
          if (validation.passed && !completedSteps.has(currentStep.stepId)) {
            const newCompleted = new Set(completedSteps);
            newCompleted.add(currentStep.stepId);
            setCompletedSteps(newCompleted);
            
            // Notify parent
            onStepComplete?.(
              currentStep.stepId,
              currentStep.reward.stars,
              currentStep.reward.badge
            );
            
            // Check if this was the last step
            if (currentStepIndex === mission.steps.length - 1) {
              setShowCelebration(true);
              onMissionComplete?.(mission.missionId);
            }
          }
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong!";
      setError(friendlyError(errorMessage));
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    if (currentStep) {
      setCode(currentStep.starterCode);
      setOutput("");
      setError("");
      setValidationResult(null);
    }
  };

  // Handle hero save for creative missions
  const handleHeroSave = async (data: { name: string; pixels: string[][] }) => {
    try {
      const response = await fetch("/api/characters/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId,
          name: data.name,
          pixelData: data.pixels,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save hero");
      }

      // Notify parent component
      onHeroSaved?.(data.pixels);

      // Mark step as complete
      if (currentStep && !completedSteps.has(currentStep.stepId)) {
        const newCompleted = new Set(completedSteps);
        newCompleted.add(currentStep.stepId);
        setCompletedSteps(newCompleted);

        onStepComplete?.(
          currentStep.stepId,
          currentStep.reward.stars,
          currentStep.reward.badge
        );

        // Show celebration for mission complete
        setShowCelebration(true);
        onMissionComplete?.(mission.missionId);
      }
    } catch (error) {
      console.error("Failed to save hero:", error);
    }
  };

  // Check if this is a creative mission
  const isCreativeMission = mission.missionType === 'creative';

  const goToPrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const goToNextStep = () => {
    if (currentStepIndex < mission.steps.length - 1 && 
        completedSteps.has(currentStep.stepId)) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const lineCount = code.split("\n").length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900">
      {/* Confetti celebration */}
      <AnimatePresence>
        {showCelebration && <Confetti />}
      </AnimatePresence>

      {/* Celebration modal */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6"
            onClick={() => setShowCelebration(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-white rounded-3xl max-w-md w-full p-8 text-center"
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
                className="text-3xl font-bold text-violet-900 mb-4"
              >
                Amazing, {childName}!
              </motion.h2>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-gray-600 mb-6"
              >
                You completed {mission.title}!
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-center gap-4 mb-8"
              >
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="flex items-center gap-1 bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm font-medium">
                  <Trophy className="w-4 h-4" />
                  Mission Complete!
                </span>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold px-8 py-4 rounded-2xl hover:from-violet-700 hover:to-indigo-700 transition-all"
                >
                  <PartyPopper className="w-5 h-5" />
                  Continue Adventure
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-[1800px] mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-white font-bold">{mission.title}</span>
            <span className="text-white/50">•</span>
            <span className="text-white/70 text-sm">
              Step {currentStepIndex + 1} of {mission.steps.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-medium">
              {Array.from(completedSteps).reduce((acc, stepId) => {
                const step = mission.steps.find(s => s.stepId === stepId);
                return acc + (step?.reward.stars || 0);
              }, 0)} ⭐
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-[1800px] mx-auto p-4">
        {/* Creative Mission - Character Creator */}
        {isCreativeMission ? (
          <CharacterCreator
            initialPixels={heroPixels}
            initialName="My Hero"
            onSave={handleHeroSave}
            childName={childName}
          />
        ) : (
        <div className="grid lg:grid-cols-[1fr_400px] gap-4 h-[calc(100vh-80px)]">
          {/* Left side: Code editor + Game preview */}
          <div className="flex flex-col gap-4 min-h-0">
            {/* Code Editor */}
            <div className="flex-1 min-h-0 rounded-2xl overflow-hidden border-2 border-white/10 bg-slate-950 shadow-xl flex flex-col">
              {/* Editor Header */}
              <div className="bg-slate-800 px-4 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-white/70 text-sm font-medium ml-2">🐍 Python Code</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {currentStep?.hint && (
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        showHint 
                          ? "bg-amber-500 text-white" 
                          : "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                      }`}
                    >
                      <Lightbulb className="w-4 h-4" />
                      Hint
                    </button>
                  )}
                  
                  <button
                    onClick={resetCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white/10 text-white/70 hover:bg-white/20 transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                  
                  <button
                    onClick={runCode}
                    disabled={isRunning}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                      isRunning
                        ? "bg-gray-500 text-white cursor-wait"
                        : "bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-105"
                    }`}
                  >
                    {isRunning ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Run Code
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Hint Box */}
              {showHint && currentStep?.hint && (
                <div className="bg-amber-950/50 border-b border-amber-500/30 px-4 py-3 shrink-0">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-amber-200 text-sm">{currentStep.hint}</p>
                  </div>
                </div>
              )}

              {/* Code Input Area */}
              <div className="relative flex-1 flex bg-slate-950 overflow-hidden">
                {/* Line Numbers */}
                <div className="flex flex-col bg-slate-900 text-slate-500 text-sm font-mono py-3 px-3 select-none shrink-0">
                  {lineNumbers.map(num => (
                    <div key={num} className="leading-6 text-right pr-2">
                      {num}
                    </div>
                  ))}
                </div>

                {/* Code area */}
                <div className="relative flex-1 overflow-hidden">
                  {/* Syntax highlighted code (background) */}
                  <div
                    ref={highlightRef}
                    className="absolute inset-0 p-3 font-mono text-sm leading-6 whitespace-pre overflow-auto pointer-events-none"
                    dangerouslySetInnerHTML={{ __html: highlightPython(code) }}
                  />
                  
                  {/* Actual textarea (transparent, on top) */}
                  <textarea
                    ref={textareaRef}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onScroll={syncScroll}
                    className="absolute inset-0 w-full h-full p-3 font-mono text-sm leading-6 bg-transparent text-transparent caret-white resize-none outline-none"
                    spellCheck={false}
                    autoCapitalize="off"
                    autoCorrect="off"
                  />
                </div>
              </div>

              {/* Output Area */}
              <div className="border-t border-slate-700 shrink-0">
                <div className="bg-slate-800 px-4 py-2 flex items-center gap-2">
                  <span className="text-white/60 text-sm font-medium">📤 Output</span>
                  {validationResult?.passed && (
                    <span className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
                      <Check className="w-4 h-4" />
                      Step Complete!
                    </span>
                  )}
                </div>
                
                <div className="bg-slate-950 p-4 max-h-32 overflow-y-auto font-mono text-sm">
                  {error ? (
                    <div className="flex items-start gap-2 text-red-400">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <pre className="whitespace-pre-wrap">{error}</pre>
                    </div>
                  ) : output ? (
                    <pre className={`whitespace-pre-wrap ${validationResult?.passed ? "text-emerald-400" : "text-white"}`}>
                      {output}
                    </pre>
                  ) : (
                    <span className="text-slate-500">Click "Run Code" to see what happens! ✨</span>
                  )}
                </div>
              </div>
            </div>

            {/* Game Preview */}
            <div className="h-[440px] shrink-0">
              <GameCanvas 
                engine={engine}
                onEngineReady={(e) => setEngine(e)}
              />
            </div>
          </div>

          {/* Right side: Step instructions */}
          <div className="min-h-0">
            <StepPanel
              step={currentStep}
              stepNumber={currentStepIndex + 1}
              totalSteps={mission.steps.length}
              missionTitle={mission.title}
              validationResult={validationResult || undefined}
              isCompleted={completedSteps.has(currentStep.stepId)}
              onPrevStep={goToPrevStep}
              onNextStep={goToNextStep}
              hasPrevStep={currentStepIndex > 0}
              hasNextStep={currentStepIndex < mission.steps.length - 1}
            />
          </div>
        </div>
        )}
      </main>
    </div>
  );
}

