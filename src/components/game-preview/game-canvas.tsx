"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Maximize2, Minimize2 } from "lucide-react";
import { PlatformerEngine } from "@/lib/game-engine/engine";

interface GameCanvasProps {
  engine: PlatformerEngine | null;
  onEngineReady?: (engine: PlatformerEngine) => void;
}

export function GameCanvas({ engine, onEngineReady }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const engineRef = useRef<PlatformerEngine | null>(null);

  // Initialize engine when canvas is ready
  useEffect(() => {
    if (!canvasRef.current) return;
    
    if (engine) {
      engineRef.current = engine;
      engine.init(canvasRef.current);
      
      // Make engine available globally for Python
      (window as unknown as { gameEngine: PlatformerEngine }).gameEngine = engine;
      
      onEngineReady?.(engine);
    }
    
    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
      }
    };
  }, [engine, onEngineReady]);

  const handlePlay = () => {
    if (engineRef.current) {
      if (isRunning) {
        engineRef.current.pause();
      } else {
        engineRef.current.start();
      }
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    if (engineRef.current) {
      engineRef.current.restart();
      setIsRunning(false);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div 
      className={`rounded-2xl overflow-hidden border-2 border-gray-200 bg-slate-900 shadow-lg ${
        isFullscreen ? 'fixed inset-4 z-50' : ''
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-white font-medium">🎮 Game Preview</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white/10 text-white/70 hover:bg-white/20 transition-all"
            title="Reset Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button
            onClick={handlePlay}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
              isRunning
                ? "bg-amber-500 text-white hover:bg-amber-600"
                : "bg-emerald-500 text-white hover:bg-emerald-600"
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Play
              </>
            )}
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-white/10 text-white/70 hover:bg-white/20 transition-all"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative bg-slate-950">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className={`block ${isFullscreen ? 'w-full h-full' : 'w-full'}`}
          style={{ imageRendering: 'pixelated' }}
        />
        
        {/* Controls hint overlay */}
        {!isRunning && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center text-white">
              <p className="text-2xl mb-2">🎮</p>
              <p className="text-lg font-medium mb-2">Run your code to see the game!</p>
              <p className="text-sm text-white/60">
                Use arrow keys to move, SPACE to jump
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Controls legend */}
      <div className="bg-slate-800 px-4 py-2 flex items-center justify-center gap-6 text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-slate-300">←</kbd>
          <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-slate-300">→</kbd>
          Move
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-2 py-0.5 bg-slate-700 rounded text-slate-300">Space</kbd>
          Jump
        </span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-slate-300">R</kbd>
          Restart
        </span>
      </div>
    </div>
  );
}






