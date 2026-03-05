"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw, Activity } from "lucide-react";
import { PatientMonitorEngine, resetPatientEngine } from "@/lib/game-engine/patient-monitor-engine";

interface PatientPreviewProps {
  onEngineReady?: (engine: PatientMonitorEngine) => void;
  runTrigger?: number;
  onPlayClicked?: () => void;
}

export function PatientPreview({ onEngineReady, runTrigger, onPlayClicked }: PatientPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<PatientMonitorEngine | null>(null);
  const onEngineReadyRef = useRef(onEngineReady);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    onEngineReadyRef.current = onEngineReady;
  });

  // Init engine on mount
  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = resetPatientEngine();
    engineRef.current = engine;
    engine.init(canvasRef.current);

    (window as unknown as { patientEngine: PatientMonitorEngine }).patientEngine = engine;

    onEngineReadyRef.current?.(engine);

    return () => {
      engine.destroy();
    };
  }, []);

  // Auto-start when code has been run
  useEffect(() => {
    if (runTrigger && runTrigger > 0) {
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
      onPlayClicked();
    } else {
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
      <div className="bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-white/70" />
          <span className="text-white text-sm font-medium">Patient Monitor</span>
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
                : "bg-cyan-500 text-white hover:bg-cyan-600"
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
                Monitor
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
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-center">
              <button
                onClick={handleOverlayPlay}
                className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full p-4 mb-3 transition-all hover:scale-110 shadow-lg"
              >
                <Play className="w-8 h-8" />
              </button>
              <p className="text-white font-semibold">
                {onPlayClicked ? "Run your code & monitor!" : "Click to start monitoring"}
              </p>
              <p className="text-white/60 text-sm mt-1">or click Run Code in the editor</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls legend */}
      <div className="bg-slate-900 px-4 py-2 flex items-center justify-center gap-4 text-xs text-white/50 shrink-0">
        <span>set_heart_rate(bpm)</span>
        <span>•</span>
        <span>show_alert(message)</span>
        <span>•</span>
        <span>add_treatment(name)</span>
      </div>
    </div>
  );
}
