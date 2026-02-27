"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { Loader2 } from "lucide-react";
import { MissionWorkspace } from "@/components/mission";
import { Mission } from "@/lib/missions/schema";
import { platformerMissionPack } from "@/lib/missions";

// Use the canonical LevelData type from the level designer so all themes
// (space, jungle, city, ocean, castle, sky, volcano, candy) are accepted.
import type { LevelData } from "@/components/level-designer/level-designer";

interface PlayClientProps {
  mission: Mission;
  childId: string;
  childName: string;
  projectId: string;
  completedStepIds: string[];
  initialStepIndex: number;
  heroPixels?: string[][];
  levelData?: LevelData;
}

export function PlayClient({
  mission,
  childId,
  childName,
  projectId,
  completedStepIds,
  initialStepIndex,
  heroPixels: initialHeroPixels,
  levelData: initialLevelData,
}: PlayClientProps) {
  const [pyodideReady, setPyodideReady] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("Loading Python...");
  const [heroPixels, setHeroPixels] = useState<string[][] | undefined>(initialHeroPixels);
  const [levelData, setLevelData] = useState<LevelData | undefined>(initialLevelData);

  // Determine the next mission in the pack (if any)
  const missionIndex = platformerMissionPack.missions.findIndex(m => m.missionId === mission.missionId);
  const nextMissionId = missionIndex >= 0 && missionIndex < platformerMissionPack.missions.length - 1
    ? platformerMissionPack.missions[missionIndex + 1].missionId
    : undefined;

  // For creative missions, we don't need Pyodide
  const isCreativeMission = mission.missionType === 'creative';

  useEffect(() => {
    // Check if Pyodide is already loaded
    if (typeof (window as unknown as { pyodide?: unknown }).pyodide !== "undefined") {
      setPyodideReady(true);
      return;
    }

    // Wait for Pyodide to load
    const checkPyodide = setInterval(() => {
      if (typeof (window as unknown as { pyodide?: unknown }).pyodide !== "undefined") {
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

  // For creative missions, render directly without waiting for Pyodide
  if (isCreativeMission) {
    return (
      <MissionWorkspace
        mission={mission}
        childId={childId}
        childName={childName}
        initialStepIndex={initialStepIndex}
        onStepComplete={handleStepComplete}
        onMissionComplete={handleMissionComplete}
        heroPixels={heroPixels}
        onHeroSaved={(pixels) => setHeroPixels(pixels)}
        levelData={levelData}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onLevelSaved={(data) => setLevelData(data as any)}
        nextMissionId={nextMissionId}
      />
    );
  }

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
            (window as unknown as { pyodide: unknown }).pyodide = pyodide;
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
          childId={childId}
          childName={childName}
          initialStepIndex={initialStepIndex}
          onStepComplete={handleStepComplete}
          onMissionComplete={handleMissionComplete}
          heroPixels={heroPixels}
          onHeroSaved={(pixels) => setHeroPixels(pixels)}
          levelData={levelData}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onLevelSaved={(data) => setLevelData(data as any)}
          nextMissionId={nextMissionId}
        />
      )}
    </>
  );
}

