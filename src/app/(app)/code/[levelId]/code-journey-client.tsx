"use client";

import { useRouter } from "next/navigation";
import { CodingJourneyPage } from "@/components/coding-journey";
import { LevelData } from "@/components/level-designer/level-designer";

interface CodeJourneyClientProps {
  levelData: LevelData;
  childName: string;
  heroName: string;
  heroPixels?: string[][];
  initialProgress?: {
    completedSteps: string[];
    totalXp: number;
    streak: number;
    badges: string[];
    lastActiveDate?: string;
  };
  levelId: string;
}

export function CodeJourneyClient({
  levelData,
  childName,
  heroName,
  heroPixels,
  initialProgress,
  levelId,
}: CodeJourneyClientProps) {
  const router = useRouter();

  const handleProgressUpdate = async (progress: {
    completedSteps: string[];
    totalXp: number;
    streak: number;
    badges: string[];
  }) => {
    // Save progress to database
    try {
      await fetch("/api/progress/save-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          levelId,
          progress,
        }),
      });
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  };

  const handleBack = () => {
    router.push("/dashboard");
  };

  return (
    <CodingJourneyPage
      levelData={levelData}
      childName={childName}
      heroName={heroName}
      heroPixels={heroPixels}
      initialProgress={initialProgress}
      onProgressUpdate={handleProgressUpdate}
      onBack={handleBack}
    />
  );
}





