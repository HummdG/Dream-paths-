"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, RotateCcw, Gamepad2 } from "lucide-react";
import { PlatformerEngine, resetEngine } from "@/lib/game-engine/engine";
import { LevelData } from "@/components/level-designer/level-designer";

interface GamePreviewProps {
  levelData: LevelData;
  heroPixels?: string[][];
  isPlaying?: boolean;
  onEngineReady?: (engine: PlatformerEngine) => void;
}

export function GamePreview({ 
  levelData, 
  heroPixels,
  isPlaying = false,
  onEngineReady 
}: GamePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<PlatformerEngine | null>(null);
  const onEngineReadyRef = useRef(onEngineReady);
  const [isRunning, setIsRunning] = useState(false);
  const [isEngineReady, setIsEngineReady] = useState(false);

  // Keep the ref up-to-date without adding onEngineReady as an effect dependency
  useEffect(() => {
    onEngineReadyRef.current = onEngineReady;
  });

  // Initialize engine — only re-runs when heroPixels changes, NOT when the
  // parent re-renders and passes a new onEngineReady function reference.
  useEffect(() => {
    if (!canvasRef.current) return;

    // Create fresh engine
    const engine = resetEngine();
    engineRef.current = engine;
    engine.init(canvasRef.current);

    // Make available globally for Python
    (window as unknown as { gameEngine: PlatformerEngine }).gameEngine = engine;

    // Set custom hero sprite if available
    if (heroPixels && heroPixels.length > 0) {
      engine.setCustomPlayerSprite(heroPixels);
    }

    setIsEngineReady(true);
    onEngineReadyRef.current?.(engine);

    return () => {
      engine.destroy();
    };
  }, [heroPixels]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load level data when engine is ready
  const loadLevel = useCallback(() => {
    const engine = engineRef.current;
    if (!engine || !isEngineReady) return;

    // Reset and load fresh
    engine.restart();

    // Remove the default ground from createInitialState() before loading user platforms.
    engine.clearPlatforms();

    // Set theme
    engine.setTheme(levelData.theme);

    // Convert grid coordinates to pixel coordinates
    const gridSize = 20;

    // Add platforms
    levelData.objects
      .filter(obj => obj.type === 'platform')
      .forEach(platform => {
        engine.addPlatform(
          platform.x * gridSize,
          platform.y * gridSize,
          platform.width * gridSize,
          platform.height * gridSize
        );
      });

    // Add coins
    levelData.objects
      .filter(obj => obj.type === 'coin')
      .forEach(coin => {
        engine.addCoin(
          coin.x * gridSize + 10,
          coin.y * gridSize + 10
        );
      });

    // Add enemies
    levelData.objects
      .filter(obj => obj.type === 'enemy')
      .forEach(enemy => {
        engine.addEnemy(
          enemy.subtype || 'slime',
          enemy.x * gridSize,
          enemy.y * gridSize
        );
      });

    // Set player spawn — position the player so their FEET are at the bottom of
    // the spawn grid cell (spawn.y + spawn.height), not their head at spawn.y.
    // Player height in the engine is 48px; this keeps them standing on the floor.
    // Also store as the spawn point so respawns (on death) return here, not
    // the hardcoded default (100, 300) which has no platform in custom levels.
    const PLAYER_HEIGHT = 48;
    const spawn = levelData.objects.find(obj => obj.type === 'spawn');
    if (spawn) {
      const spawnPx = spawn.x * gridSize;
      const spawnPy = (spawn.y + spawn.height) * gridSize - PLAYER_HEIGHT;
      engine.setSpawnPoint(spawnPx, spawnPy);
      engine.setPlayerPosition(spawnPx, spawnPy);
    }

    // Add goal
    const goal = levelData.objects.find(obj => obj.type === 'goal');
    if (goal) {
      engine.addGoal(goal.x * gridSize, goal.y * gridSize);
    }
  }, [levelData, isEngineReady]);

  // Reload level when level data changes
  useEffect(() => {
    loadLevel();
  }, [loadLevel]);

  // Start/stop based on isPlaying prop
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine || !isEngineReady) return;

    if (isPlaying && !isRunning) {
      engine.start();
      setIsRunning(true);
    } else if (!isPlaying && isRunning) {
      // e.g. user navigated to a new step — stop and reset the overlay
      engine.stop();
      setIsRunning(false);
    }
  }, [isPlaying, isRunning, isEngineReady]);

  const handlePlay = () => {
    const engine = engineRef.current;
    if (!engine) return;

    if (isRunning) {
      engine.pause();
      setIsRunning(false);
    } else {
      engine.start();
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    const engine = engineRef.current;
    if (!engine) return;

    loadLevel();
    engine.start();
    setIsRunning(true);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 rounded-2xl overflow-hidden border border-white/10">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-4 h-4 text-white/70" />
          <span className="text-white text-sm font-medium">{levelData.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all"
            title="Restart"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handlePlay}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              isRunning
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "bg-emerald-500 text-white hover:bg-emerald-600"
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3 h-3" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-3 h-3" />
                Play
              </>
            )}
          </button>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="flex-1 relative bg-slate-950 min-h-0">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full h-full object-contain"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* Overlay when not playing */}
        {!isRunning && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center">
              <button
                onClick={handlePlay}
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-4 mb-3 transition-all hover:scale-110"
              >
                <Play className="w-8 h-8" />
              </button>
              <p className="text-white/70 text-sm">Click to play</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls Legend */}
      <div className="bg-slate-900 px-4 py-2 flex items-center justify-center gap-4 text-xs text-white/50 shrink-0">
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-white/70">←→</kbd>
          Move
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-white/70">Space</kbd>
          Jump
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1 py-0.5 bg-slate-800 rounded text-white/70">R</kbd>
          Reset
        </span>
      </div>
    </div>
  );
}





