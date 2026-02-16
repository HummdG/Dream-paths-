"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Star,
  Trophy,
  PartyPopper
} from "lucide-react";
import Link from "next/link";
import { Confetti } from "@/components/confetti";
import { GamePreview } from "@/components/coding-journey/game-preview";
import { StepPanel } from "@/components/mission/step-panel";
import { Mission } from "@/lib/missions/schema";
import { PlatformerEngine } from "@/lib/game-engine";
import { wrapUserCode } from "@/lib/game-engine/python-api";
import { validateStep, ValidationResult, friendlyError } from "@/lib/validation";
import { CharacterCreator } from "@/components/character-creator";
import { LevelDesigner, LevelData } from "@/components/level-designer";
import { SpriteDesigner } from "@/components/sprite-designer";
import { SimpleEditor } from "@/components/code-editor/simple-editor";

interface MissionWorkspaceProps {
  mission: Mission;
  initialStepIndex?: number;
  childName: string;
  childId: string;
  onStepComplete?: (stepId: string, stars: number, badge?: string) => void;
  onMissionComplete?: (missionId: string) => void;
  heroPixels?: string[][];
  onHeroSaved?: (pixels: string[][]) => void;
  levelData?: LevelData;
  onLevelSaved?: (levelData: LevelData) => void;
}

export function MissionWorkspace({
  mission,
  initialStepIndex = 0,
  childName,
  childId,
  onStepComplete,
  onMissionComplete,
  heroPixels,
  onHeroSaved,
  levelData: initialLevelData,
  onLevelSaved
}: MissionWorkspaceProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStepIndex);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const [engine, setEngine] = useState<PlatformerEngine | null>(null);
  const [currentCode, setCurrentCode] = useState("");
  const [levelData, setLevelData] = useState<LevelData | undefined>(initialLevelData);
  const [hasRunCode, setHasRunCode] = useState(false);

  // Default level data if none provided
  const defaultLevelData: LevelData = {
    name: "My Level",
    theme: "jungle",
    objects: [
      { id: "spawn", type: "spawn", x: 2, y: 18, width: 1, height: 1 },
      { id: "platform1", type: "platform", x: 0, y: 19, width: 40, height: 1 },
      { id: "goal", type: "goal", x: 35, y: 17, width: 2, height: 2 },
    ],
    settings: { winCondition: "reach_goal" }
  };

  const activeLevelData = levelData || defaultLevelData;

  const currentStep = mission.steps[currentStepIndex];

  // Reset state when step changes
  useEffect(() => {
    if (currentStep) {
      setValidationResult(null);
      setCurrentCode(currentStep.starterCode);
      setHasRunCode(false);
    }
  }, [currentStep]);

  // Run code handler for SimpleEditor
  const handleRunCode = async (code: string): Promise<{ output: string; error?: string; success?: boolean }> => {
    setCurrentCode(code);
    setHasRunCode(true);
    
    try {
      // Start the game engine first so code can control it
      // Use window.gameEngine directly to ensure we start the actual engine instance
      // that Python will access, not just the React state reference
      const windowEngine = (window as unknown as { gameEngine?: { start: () => void } }).gameEngine;
      if (windowEngine) {
        windowEngine.start();
      } else if (engine) {
        engine.start();
      }
      
      // Longer delay to ensure engine is fully running and ready for Python commands
      await new Promise(resolve => setTimeout(resolve, 200));

      // @ts-expect-error - Pyodide is loaded globally
      if (typeof window.pyodide === "undefined") {
        return { output: "", error: "Python is still loading... Please wait a moment and try again!" };
      }

      // @ts-expect-error - Pyodide is loaded globally
      const pyodide = window.pyodide;
      
      const wrappedCode = wrapUserCode(code);
      
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
      
      // Get events from the game engine for validation
      await new Promise(resolve => setTimeout(resolve, 500));
      const events = engine?.getEvents() || [];
      
      if (currentStep) {
        const validation = validateStep(
          code,
          printOutput,
          events,
          currentStep.validation
        );
        setValidationResult(validation);
        
        if (validation.passed && !completedSteps.has(currentStep.stepId)) {
          const newCompleted = new Set(completedSteps);
          newCompleted.add(currentStep.stepId);
          setCompletedSteps(newCompleted);
          
          onStepComplete?.(
            currentStep.stepId,
            currentStep.reward.stars,
            currentStep.reward.badge
          );
          
          if (currentStepIndex === mission.steps.length - 1) {
            setShowCelebration(true);
            onMissionComplete?.(mission.missionId);
          }
          
          return { output: printOutput.trim(), success: true };
        }
      }
      
      return { output: printOutput.trim() };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong!";
      return { output: "", error: friendlyError(errorMessage) };
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
      markCurrentStepComplete();
    } catch (error) {
      console.error("Failed to save hero:", error);
    }
  };

  // Handle level save for level design missions
  const handleLevelSave = async (savedLevelData: LevelData) => {
    try {
      const response = await fetch("/api/levels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId,
          name: savedLevelData.name,
          theme: savedLevelData.theme,
          gridData: {},
          objects: savedLevelData.objects,
          settings: savedLevelData.settings,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save level");
      }

      // Update local state so subsequent missions can use this level
      setLevelData(savedLevelData);
      
      // Notify parent component
      onLevelSaved?.(savedLevelData);

      // Mark step as complete
      markCurrentStepComplete();
    } catch (error) {
      console.error("Failed to save level:", error);
    }
  };

  // Handle level test
  const handleLevelTest = (levelData: LevelData) => {
    // Could launch a test preview mode
    console.log("Testing level:", levelData);
  };

  // Handle sprite save for sprite design missions
  const handleSpriteSave = async (data: { 
    name: string; 
    category: string; 
    pixels: string[][]; 
    behavior?: { type: string; speed: number; range: number; } 
  }) => {
    try {
      const response = await fetch("/api/sprites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childId,
          name: data.name,
          type: data.category.toUpperCase(),
          pixelData: data.pixels,
          behavior: data.behavior,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save sprite");
      }

      // Mark step as complete
      markCurrentStepComplete();
    } catch (error) {
      console.error("Failed to save sprite:", error);
    }
  };

  // Helper to mark current step complete
  const markCurrentStepComplete = () => {
    if (currentStep && !completedSteps.has(currentStep.stepId)) {
      const newCompleted = new Set(completedSteps);
      newCompleted.add(currentStep.stepId);
      setCompletedSteps(newCompleted);

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
  };

  // Check mission type
  const isCreativeMission = mission.missionType === 'creative';
  const isLevelDesignMission = mission.missionType === 'level_design';
  const isSpriteDesignMission = mission.missionType === 'sprite_design';

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
        ) : isLevelDesignMission ? (
          /* Level Design Mission - Level Designer */
          <LevelDesigner
            heroPixels={heroPixels}
            onSave={handleLevelSave}
            onTest={handleLevelTest}
            childName={childName}
          />
        ) : isSpriteDesignMission ? (
          /* Sprite Design Mission - Sprite Designer */
          <SpriteDesigner
            onSave={handleSpriteSave}
            childName={childName}
          />
        ) : (
        <div className="grid lg:grid-cols-[1fr_400px] gap-4 h-[calc(100vh-80px)]">
          {/* Left side: Code editor + Game preview */}
          <div className="flex flex-col gap-4 min-h-0">
            {/* Simple Code Editor */}
            <div className="flex-1 min-h-0">
              <SimpleEditor
                initialCode={currentStep?.starterCode || ""}
                hint={currentStep?.hint}
                onRun={handleRunCode}
                onCodeChange={setCurrentCode}
                height="380px"
                showGameHint
              />
            </div>

            {/* Game Preview */}
            <div className="h-[440px] shrink-0">
              <GamePreview 
                levelData={activeLevelData}
                heroPixels={heroPixels}
                isPlaying={hasRunCode}
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

