"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Gamepad2 } from "lucide-react";
import { SnakeEngine, resetSnakeEngine } from "@/lib/game-engine/snake-engine";

interface SnakePreviewProps {
  onEngineReady?: (engine: SnakeEngine) => void;
  /**
   * Increment this counter each time user code is run.
   * The preview will start automatically and remove the "click to play" overlay.
   */
  runTrigger?: number;
  /**
   * Called when the "Click to Play" overlay button is pressed.
   * If provided, the caller is responsible for starting the engine (e.g. by running code).
   * If not provided, the preview just starts the engine directly.
   */
  onPlayClicked?: () => void;
}

export function SnakePreview({ onEngineReady, runTrigger, onPlayClicked }: SnakePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<SnakeEngine | null>(null);
  const onEngineReadyRef = useRef(onEngineReady);
  const [isRunning, setIsRunning] = useState(false);

  // Keep callback ref current without re-triggering effects
  useEffect(() => {
    onEngineReadyRef.current = onEngineReady;
  });

  // Init engine on mount
  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = resetSnakeEngine();
    engineRef.current = engine;
    engine.init(canvasRef.current);

    // Expose globally so Python (via Pyodide) can access it
    (window as unknown as { snakeEngine: SnakeEngine }).snakeEngine = engine;

    onEngineReadyRef.current?.(engine);

    return () => {
      engine.destroy();
    };
  }, []);

  // Auto-start when code has been run (runTrigger increments)
  useEffect(() => {
    if (runTrigger && runTrigger > 0) {
      // The engine was already restarted + started by MissionWorkspace.
      // Update our UI state so the overlay disappears.
      setIsRunning(true);
    }
  }, [runTrigger]);

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

    engine.restart();
    engine.start();
    setIsRunning(true);
  };

  const handleOverlayPlay = () => {
    if (onPlayClicked) {
      // Caller runs the code (which also starts the engine)
      onPlayClicked();
    } else {
      // No code to run — just start the engine directly
      const engine = engineRef.current;
      if (engine) {
        engine.start();
        setIsRunning(true);
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 rounded-2xl overflow-hidden border border-white/10">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-4 h-4 text-white/70" />
          <span className="text-white text-sm font-medium">Snake Game</span>
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

      {/* Canvas */}
      <div className="flex-1 relative bg-slate-950 min-h-0">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="w-full h-full object-contain"
          style={{ imageRendering: "pixelated" }}
        />

        {/* Overlay when not running */}
        {!isRunning && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center">
              <button
                onClick={handleOverlayPlay}
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full p-4 mb-3 transition-all hover:scale-110 shadow-lg"
              >
                <Play className="w-8 h-8" />
              </button>
              <p className="text-white font-semibold">
                {onPlayClicked ? "Run your code & play!" : "Click to play"}
              </p>
              <p className="text-white/60 text-sm mt-1">or click Run Code in the editor</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls legend */}
      <div className="bg-slate-900 px-4 py-2 flex items-center justify-center gap-4 text-xs text-white/50 shrink-0">
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-white/70">↑↓←→</kbd>
          Steer snake
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1 py-0.5 bg-slate-800 rounded text-white/70">R</kbd>
          Reset
        </span>
      </div>
    </div>
  );
}
