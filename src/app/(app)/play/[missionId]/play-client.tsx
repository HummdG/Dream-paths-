"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { Loader2 } from "lucide-react";
import { MissionWorkspace } from "@/components/mission";
import { Mission } from "@/lib/missions/schema";

interface PlayClientProps {
  mission: Mission;
  childName: string;
  projectId: string;
  completedStepIds: string[];
  initialStepIndex: number;
}

export function PlayClient({
  mission,
  childName,
  projectId,
  completedStepIds,
  initialStepIndex,
}: PlayClientProps) {
  const [pyodideReady, setPyodideReady] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("Loading Python...");

  useEffect(() => {
    // Check if Pyodide is already loaded
    // @ts-expect-error - Pyodide is loaded globally
    if (typeof window.pyodide !== "undefined") {
      setPyodideReady(true);
      return;
    }

    // Wait for Pyodide to load
    const checkPyodide = setInterval(() => {
      // @ts-expect-error - Pyodide is loaded globally
      if (typeof window.pyodide !== "undefined") {
        setPyodideReady(true);
        clearInterval(checkPyodide);
      }
    }, 100);

    return () => clearInterval(checkPyodide);
  }, []);

  const handleStepComplete = async (stepId: string, stars: number, badge?: string) => {
    try {
      await fetch("/api/progress/step-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          missionId: mission.missionId,
          stepId,
          stars,
          badge,
        }),
      });
    } catch (error) {
      console.error("Failed to save step progress:", error);
    }
  };

  const handleMissionComplete = async (missionId: string) => {
    try {
      await fetch("/api/progress/mission-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          missionId,
        }),
      });
    } catch (error) {
      console.error("Failed to save mission progress:", error);
    }
  };

  return (
    <>
      {/* Load Pyodide */}
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js"
        onLoad={async () => {
          setLoadingStatus("Initializing Python...");
          try {
            // @ts-expect-error - loadPyodide is loaded globally
            const pyodide = await loadPyodide({
              indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
            });
            // @ts-expect-error - Setting global pyodide
            window.pyodide = pyodide;
            setPyodideReady(true);
          } catch (error) {
            console.error("Failed to load Pyodide:", error);
            setLoadingStatus("Failed to load Python. Please refresh the page.");
          }
        }}
      />

      {!pyodideReady ? (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-violet-900 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-violet-400 animate-spin mx-auto mb-4" />
            <p className="text-white text-lg">{loadingStatus}</p>
            <p className="text-white/60 text-sm mt-2">
              Getting your coding environment ready...
            </p>
          </div>
        </div>
      ) : (
        <MissionWorkspace
          mission={mission}
          childName={childName}
          initialStepIndex={initialStepIndex}
          onStepComplete={handleStepComplete}
          onMissionComplete={handleMissionComplete}
        />
      )}
    </>
  );
}

