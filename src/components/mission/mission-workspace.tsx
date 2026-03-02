"use client";

import { useEffect, useRef, useState } from "react";
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
import { SnakePreview } from "@/components/game-preview/snake-preview";
import { StepPanel } from "@/components/mission/step-panel";
import { Mission } from "@/lib/missions/schema";
import { PlatformerEngine } from "@/lib/game-engine";
import { wrapUserCode } from "@/lib/game-engine/python-api";
import { wrapSnakeUserCode } from "@/lib/game-engine/snake-python-api";
import { SnakeEngine } from "@/lib/game-engine/snake-engine";
import { validateStep, ValidationResult, friendlyError } from "@/lib/validation";
import { CharacterCreator } from "@/components/character-creator";
import { LevelDesigner, LevelData } from "@/components/level-designer";
import { SpriteDesigner } from "@/components/sprite-designer";
import { SimpleEditor } from "@/components/code-editor/simple-editor";
import { SnakeTour } from "@/components/mission/snake-tour";

// Grid size must match game-preview.tsx's gridSize constant.
const GRID_SIZE = 20;
// Must match the player height defined in engine.ts createInitialState().
const PLAYER_HEIGHT = 48;

/**
 * Re-apply the user's level data into a live engine instance.
 * Call this after engine.restart() so the user's custom platforms/coins/etc.
 * are not lost. Also sets the player at the correct spawn position.
 */
function loadLevelIntoEngine(eng: PlatformerEngine, levelData: LevelData): void {
  // Remove the default ground created by createInitialState() so it doesn't
  // conflict with the user's custom level platforms.
  eng.clearPlatforms();
  eng.setTheme(levelData.theme);

  levelData.objects
    .filter(o => o.type === 'platform')
    .forEach(p => eng.addPlatform(p.x * GRID_SIZE, p.y * GRID_SIZE, p.width * GRID_SIZE, p.height * GRID_SIZE));

  levelData.objects
    .filter(o => o.type === 'coin')
    .forEach(c => eng.addCoin(c.x * GRID_SIZE + 10, c.y * GRID_SIZE + 10));

  levelData.objects
    .filter(o => o.type === 'enemy')
    .forEach(e => eng.addEnemy(e.subtype || 'slime', e.x * GRID_SIZE, e.y * GRID_SIZE));

  const spawn = levelData.objects.find(o => o.type === 'spawn');
  if (spawn) {
    const spawnPx = spawn.x * GRID_SIZE;
    const spawnPy = (spawn.y + spawn.height) * GRID_SIZE - PLAYER_HEIGHT;
    eng.setSpawnPoint(spawnPx, spawnPy);
    eng.setPlayerPosition(spawnPx, spawnPy);
  }

  const goal = levelData.objects.find(o => o.type === 'goal');
  if (goal) {
    eng.addGoal(goal.x * GRID_SIZE, goal.y * GRID_SIZE);
  }
}

interface MissionWorkspaceProps {
  mission: Mission;
  initialStepIndex?: number;
  completedStepIds?: string[];
  /** Saved code per stepId — restores the user's last run code when they return */
  savedCodes?: Record<string, string>;
  childName: string;
  childId: string;
  onStepComplete?: (stepId: string, stars: number, badge?: string) => void;
  onSaveCode?: (stepId: string, code: string) => void;
  onMissionComplete?: (missionId: string) => void;
  heroPixels?: string[][];
  onHeroSaved?: (pixels: string[][]) => void;
  levelData?: LevelData;
  onLevelSaved?: (levelData: LevelData) => void;
  nextMissionId?: string;
}

export function MissionWorkspace({
  mission,
  initialStepIndex = 0,
  completedStepIds = [],
  savedCodes,
  childName,
  childId,
  onStepComplete,
  onSaveCode,
  onMissionComplete,
  heroPixels,
  onHeroSaved,
  levelData: initialLevelData,
  onLevelSaved,
  nextMissionId,
}: MissionWorkspaceProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(initialStepIndex);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  // Initialise from server-provided completed step IDs so returning to a mission
  // that is partially or fully done doesn't re-trigger validation incorrectly.
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set(completedStepIds));
  const [showCelebration, setShowCelebration] = useState(false);
  const [engine, setEngine] = useState<PlatformerEngine | null>(null);
  const [currentCode, setCurrentCode] = useState("");
  const [levelData, setLevelData] = useState<LevelData | undefined>(initialLevelData);
  const [hasRunCode, setHasRunCode] = useState(false);
  const [snakeRunTrigger, setSnakeRunTrigger] = useState(0);
  const gamePreviewRef = useRef<HTMLDivElement>(null);

  const isSnakeMission = mission.engineType === 'snake';

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

  // Reset state when step changes — use the user's last saved code if available
  useEffect(() => {
    if (currentStep) {
      setValidationResult(null);
      setCurrentCode(savedCodes?.[currentStep.stepId] ?? currentStep.starterCode);
      setHasRunCode(false); // resets the scroll-to-game trigger for the new step

      if (isSnakeMission) {
        const snakeEng = (window as unknown as { snakeEngine?: SnakeEngine }).snakeEngine;
        if (snakeEng) {
          snakeEng.clearCallbacks();
          snakeEng.clearEvents();
          snakeEng.restart();
        }
      } else {
        const windowEngine = (window as unknown as { gameEngine?: PlatformerEngine }).gameEngine;
        if (windowEngine) {
          windowEngine.restart();
          loadLevelIntoEngine(windowEngine, activeLevelData);
          // Keep the game running at 60fps between steps — don't stop the engine
          windowEngine.start();
        }
      }
    }
  }, [currentStep?.stepId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Scroll the game canvas into view the first time the user runs code on each step
  useEffect(() => {
    if (hasRunCode && gamePreviewRef.current) {
      gamePreviewRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [hasRunCode]);

  // Run code handler for SimpleEditor
  const handleRunCode = async (code: string): Promise<{ output: string; error?: string; success?: boolean }> => {
    setCurrentCode(code);
    setHasRunCode(true);

    // Persist the code so the user can resume from here on their next visit
    if (currentStep) {
      onSaveCode?.(currentStep.stepId, code);
    }

    try {
      const win = window as unknown as {
        pyodide?: { runPythonAsync: (code: string) => Promise<string> };
        gameEngine?: PlatformerEngine;
        snakeEngine?: SnakeEngine;
      };

      if (typeof win.pyodide === "undefined") {
        return { output: "", error: "Python is still loading... Please wait a moment and try again!" };
      }

      const pyodide = win.pyodide;
      let wrappedCode: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let events: any[] = [];

      if (isSnakeMission) {
        // ── Snake execution path ──────────────────────────────────────────────
        const snakeEng = win.snakeEngine;
        if (snakeEng) {
          snakeEng.clearCallbacks();
          snakeEng.clearEvents();
          snakeEng.restart();
          snakeEng.start();
        }

        wrappedCode = wrapSnakeUserCode(code);

        const snakeRunner = `
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
        const result = await pyodide.runPythonAsync(snakeRunner);
        const printOutput = result || "";

        // Wait for a few ticks to fire before collecting events
        await new Promise(resolve => setTimeout(resolve, 1000));
        events = snakeEng?.getEvents() ?? [];

        // Tell SnakePreview the game is now running (removes "click to play" overlay)
        setSnakeRunTrigger(t => t + 1);

        if (currentStep) {
          const validation = validateStep(code, printOutput, events, currentStep.validation);
          setValidationResult(validation);

          if (validation.passed && !completedSteps.has(currentStep.stepId)) {
            const newCompleted = new Set(completedSteps);
            newCompleted.add(currentStep.stepId);
            setCompletedSteps(newCompleted);
            onStepComplete?.(currentStep.stepId, currentStep.reward.stars, currentStep.reward.badge);

            if (newCompleted.size === mission.steps.length) {
              setShowCelebration(true);
              onMissionComplete?.(mission.missionId);
            }
          }
        }

        return { output: printOutput.trim() };
      }

      // ── Platformer execution path (unchanged) ─────────────────────────────
      const windowEngine = win.gameEngine;
      const activeEngine = windowEngine || engine;
      if (activeEngine) {
        activeEngine.start(); // no-op if already running (double-start guard in place)

        // Reset platforms before Python runs to prevent stacking across multiple runs.
        activeEngine.clearPlatforms();
        const pythonAddsPlatforms = code.includes('add_platform(');
        if (pythonAddsPlatforms) {
          activeLevelData.objects
            .filter((o) => o.type === 'platform')
            .forEach((p) =>
              activeEngine.addPlatform(
                p.x * GRID_SIZE,
                p.y * GRID_SIZE,
                p.width * GRID_SIZE,
                p.height * GRID_SIZE,
              )
            );
        } else {
          activeEngine.addPlatform(0, 380, 800, 20);
        }
      }

      wrappedCode = wrapUserCode(code);

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

      // Wait for physics frames to run before collecting events
      await new Promise(resolve => setTimeout(resolve, 800));
      events = activeEngine?.getEvents() || [];

      if (currentStep) {
        const validation = validateStep(
          code,
          printOutput,
          events,
          currentStep.validation
        );
        setValidationResult(validation);

        // Auto-mark step complete when all checks pass
        if (validation.passed && currentStep && !completedSteps.has(currentStep.stepId)) {
          const newCompleted = new Set(completedSteps);
          newCompleted.add(currentStep.stepId);
          setCompletedSteps(newCompleted);
          onStepComplete?.(currentStep.stepId, currentStep.reward.stars, currentStep.reward.badge);

          if (newCompleted.size === mission.steps.length) {
            setShowCelebration(true);
            onMissionComplete?.(mission.missionId);
          }
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
    // Save the level to the DB (simple POST - duplicates are fine, latest is always used)
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

    // Complete ALL steps and the mission in one go
    markAllStepsComplete();
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

  // Helper to mark ALL steps complete at once (used for level_design missions)
  const markAllStepsComplete = () => {
    const newCompleted = new Set(completedSteps);

    for (const step of mission.steps) {
      if (!newCompleted.has(step.stepId)) {
        newCompleted.add(step.stepId);
        onStepComplete?.(step.stepId, step.reward.stars, step.reward.badge);
      }
    }

    setCompletedSteps(newCompleted);
    setShowCelebration(true);
    onMissionComplete?.(mission.missionId);
  };

  // Called when user explicitly clicks "Mark Complete" in StepPanel
  const handleCompleteStep = () => {
    markCurrentStepComplete();
  };

  // Check mission type
  const isCreativeMission = mission.missionType === 'creative';
  const isLevelDesignMission = mission.missionType === 'level_design';
  const isSpriteDesignMission = mission.missionType === 'sprite_design';
  // isSnakeMission is declared near top of component

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
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-6"
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
                className="flex flex-col gap-3"
              >
                {nextMissionId ? (
                  <Link
                    href={`/play/${nextMissionId}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold px-8 py-4 rounded-2xl hover:from-violet-700 hover:to-indigo-700 transition-all"
                  >
                    <PartyPopper className="w-5 h-5" />
                    Next Mission
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold px-8 py-4 rounded-2xl hover:from-violet-700 hover:to-indigo-700 transition-all"
                  >
                    <PartyPopper className="w-5 h-5" />
                    Back to Map
                  </Link>
                )}
                <button
                  onClick={() => setShowCelebration(false)}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-100 text-emerald-700 font-bold px-8 py-3 rounded-2xl hover:bg-emerald-200 transition-all"
                >
                  🎮 Keep Experimenting
                </button>
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
        <div className="grid lg:grid-cols-[1fr_400px] gap-4">
          {/* Snake-only UI tour — shown once, on first visit to sn1_hello_python */}
          {isSnakeMission && <SnakeTour missionId={mission.missionId} />}

          {/* Left side: Code editor + Game preview — natural height, scrollable on small screens */}
          <div className="flex flex-col gap-4">
            <div data-tour="code-editor">
              <SimpleEditor
                initialCode={currentStep ? (savedCodes?.[currentStep.stepId] ?? currentStep.starterCode) : ""}
                hint={currentStep?.hint}
                onRun={handleRunCode}
                onCodeChange={setCurrentCode}
                height="340px"
                showGameHint
                validationChecks={validationResult?.checks}
              />
            </div>

            {/* Game Preview — snake or platformer depending on mission */}
            <div className="h-[520px]" ref={gamePreviewRef} data-tour="game-preview">
              {isSnakeMission ? (
                <SnakePreview
                  runTrigger={snakeRunTrigger}
                  onPlayClicked={() => handleRunCode(currentCode)}
                />
              ) : (
                <GamePreview
                  levelData={activeLevelData}
                  heroPixels={heroPixels}
                  isPlaying={true}
                  onEngineReady={(e) => setEngine(e)}
                />
              )}
            </div>
          </div>

          {/* Right side: sticky so step instructions stay in view as user scrolls */}
          <div
            data-tour="step-panel"
            className="lg:sticky lg:top-[72px] lg:self-start lg:max-h-[calc(100vh-88px)] lg:overflow-y-auto"
          >
            <StepPanel
              step={currentStep}
              stepNumber={currentStepIndex + 1}
              totalSteps={mission.steps.length}
              missionTitle={mission.title}
              validationResult={validationResult || undefined}
              isCompleted={completedSteps.has(currentStep.stepId)}
              onCompleteStep={handleCompleteStep}
              onPrevStep={goToPrevStep}
              onNextStep={goToNextStep}
              hasPrevStep={currentStepIndex > 0}
              hasNextStep={currentStepIndex < mission.steps.length - 1}
              nextMissionId={nextMissionId}
              allStepsComplete={completedSteps.size === mission.steps.length}
            />
          </div>
        </div>
        )}
      </main>
    </div>
  );
}

