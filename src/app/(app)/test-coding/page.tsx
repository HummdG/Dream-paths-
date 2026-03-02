"use client";

import { CodingJourneyPage } from "@/components/coding-journey";
import { LevelData } from "@/components/level-designer/level-designer";
import { PyodideLoader } from "@/components/code-editor/pyodide-loader";

// Sample level data for testing
const SAMPLE_LEVEL: LevelData = {
  name: "My First Adventure",
  theme: "jungle",
  objects: [
    // Ground platforms
    { id: "ground_1", type: "platform", x: 0, y: 22, width: 15, height: 3, subtype: "solid" },
    { id: "ground_2", type: "platform", x: 20, y: 22, width: 10, height: 3, subtype: "solid" },
    { id: "ground_3", type: "platform", x: 35, y: 22, width: 10, height: 3, subtype: "solid" },
    
    // Floating platforms
    { id: "plat_1", type: "platform", x: 8, y: 18, width: 6, height: 1, subtype: "solid" },
    { id: "plat_2", type: "platform", x: 18, y: 15, width: 6, height: 1, subtype: "solid" },
    { id: "plat_3", type: "platform", x: 28, y: 12, width: 6, height: 1, subtype: "solid" },
    
    // Coins
    { id: "coin_1", type: "coin", x: 5, y: 20, width: 1, height: 1 },
    { id: "coin_2", type: "coin", x: 10, y: 16, width: 1, height: 1 },
    { id: "coin_3", type: "coin", x: 20, y: 13, width: 1, height: 1 },
    { id: "coin_4", type: "coin", x: 30, y: 10, width: 1, height: 1 },
    { id: "coin_5", type: "coin", x: 38, y: 20, width: 1, height: 1 },
    
    // Enemy
    { id: "enemy_1", type: "enemy", x: 22, y: 21, width: 1, height: 1, subtype: "slime" },
    
    // Spawn and Goal
    { id: "spawn_1", type: "spawn", x: 2, y: 20, width: 1, height: 2 },
    { id: "goal_1", type: "goal", x: 42, y: 20, width: 1, height: 2 },
  ],
  settings: {
    winCondition: "reach_goal",
  },
};

// Sample hero pixel art (simple robot)
const SAMPLE_HERO_PIXELS: string[][] = [
  ['transparent', 'transparent', 'transparent', 'transparent', 'transparent', '#4a90d9', '#4a90d9', '#4a90d9', '#4a90d9', '#4a90d9', '#4a90d9', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent'],
  ['transparent', 'transparent', 'transparent', 'transparent', '#4a90d9', '#4a90d9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#4a90d9', '#4a90d9', 'transparent', 'transparent', 'transparent', 'transparent'],
  ['transparent', 'transparent', 'transparent', '#4a90d9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#8ad0ff', '#8ad0ff', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#4a90d9', 'transparent', 'transparent', 'transparent'],
  ['transparent', 'transparent', '#4a90d9', '#6ab0f9', '#6ab0f9', '#ffffff', '#ffffff', '#6ab0f9', '#6ab0f9', '#ffffff', '#ffffff', '#6ab0f9', '#6ab0f9', '#4a90d9', 'transparent', 'transparent'],
  ['transparent', 'transparent', '#4a90d9', '#6ab0f9', '#6ab0f9', '#000000', '#ffffff', '#6ab0f9', '#6ab0f9', '#000000', '#ffffff', '#6ab0f9', '#6ab0f9', '#4a90d9', 'transparent', 'transparent'],
  ['transparent', 'transparent', '#4a90d9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#4a90d9', 'transparent', 'transparent'],
  ['transparent', 'transparent', 'transparent', '#4a90d9', '#6ab0f9', '#6ab0f9', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#ff6b6b', '#6ab0f9', '#6ab0f9', '#4a90d9', 'transparent', 'transparent', 'transparent'],
  ['transparent', 'transparent', 'transparent', 'transparent', '#4a90d9', '#4a90d9', '#4a90d9', '#4a90d9', '#4a90d9', '#4a90d9', '#4a90d9', '#4a90d9', 'transparent', 'transparent', 'transparent', 'transparent'],
  ['transparent', 'transparent', 'transparent', '#4a90d9', '#4a90d9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#4a90d9', '#4a90d9', 'transparent', 'transparent', 'transparent'],
  ['transparent', 'transparent', '#4a90d9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#4a90d9', 'transparent', 'transparent'],
  ['transparent', '#4a90d9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#ffd93d', '#ffd93d', '#ffd93d', '#ffd93d', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#4a90d9', 'transparent'],
  ['transparent', '#4a90d9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#4a90d9', 'transparent'],
  ['transparent', '#4a90d9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#4a90d9', 'transparent'],
  ['transparent', 'transparent', '#4a90d9', '#4a90d9', '#6ab0f9', '#6ab0f9', '#6ab0f9', 'transparent', 'transparent', '#6ab0f9', '#6ab0f9', '#6ab0f9', '#4a90d9', '#4a90d9', 'transparent', 'transparent'],
  ['transparent', 'transparent', 'transparent', '#4a90d9', '#4a90d9', '#4a90d9', '#4a90d9', 'transparent', 'transparent', '#4a90d9', '#4a90d9', '#4a90d9', '#4a90d9', 'transparent', 'transparent', 'transparent'],
  ['transparent', 'transparent', 'transparent', '#3a3a3a', '#3a3a3a', '#3a3a3a', '#3a3a3a', 'transparent', 'transparent', '#3a3a3a', '#3a3a3a', '#3a3a3a', '#3a3a3a', 'transparent', 'transparent', 'transparent'],
];

export default function TestCodingPage() {
  return (
    <PyodideLoader>
    <CodingJourneyPage
      levelData={SAMPLE_LEVEL}
      childName="Tester"
      heroName="Robo"
      heroPixels={SAMPLE_HERO_PIXELS}
      initialProgress={{
        completedSteps: [],
        totalXp: 0,
        streak: 1,
        badges: [],
        lastActiveDate: new Date().toISOString(),
      }}
      onProgressUpdate={(progress) => {
        console.log("Progress updated:", progress);
      }}
      onBack={() => {
        window.history.back();
      }}
    />
    </PyodideLoader>
  );
}

