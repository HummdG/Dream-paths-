export interface MissionTile {
  title: string;
  emoji: string;
}

export interface PackSection {
  title: string;
  emoji: string;
  freeBadge?: boolean;
  pathBadge?: string;
  missions: MissionTile[];
}

export interface PathSlide {
  pathId: string;
  label: string;
  emoji: string;
  packs: PackSection[];
}

export const PATH_SLIDES: PathSlide[] = [
  {
    pathId: "computer_scientist",
    label: "Computer Scientist",
    emoji: "💻",
    packs: [
      {
        title: "Snake Tutorial",
        emoji: "🐍",
        freeBadge: true,
        missions: [
          { title: "Hello Python", emoji: "🐍" },
          { title: "Functions & Movement", emoji: "⚙️" },
          { title: "Keyboard Controls", emoji: "⌨️" },
          { title: "Score & Game Over", emoji: "🏆" },
        ],
      },
      {
        title: "Platformer Game",
        emoji: "🎮",
        pathBadge: "Computer Scientist path",
        missions: [
          { title: "Design Your Hero", emoji: "🎨" },
          { title: "Run & Explore", emoji: "🏃" },
          { title: "Build Your Scene", emoji: "🏗️" },
          { title: "Gravity & Jumping", emoji: "🦘" },
          { title: "Collisions", emoji: "💥" },
          { title: "Collect & Score", emoji: "🪙" },
          { title: "Enemies", emoji: "👾" },
          { title: "Win & Polish", emoji: "🏁" },
        ],
      },
    ],
  },
  {
    pathId: "astronaut",
    label: "Astronaut",
    emoji: "🚀",
    packs: [
      {
        title: "Space Cadet Program",
        emoji: "🛸",
        freeBadge: true,
        missions: [
          { title: "Mission Briefing", emoji: "📋" },
          { title: "Rocket Functions", emoji: "🔧" },
          { title: "Keyboard Controls", emoji: "⌨️" },
          { title: "Reach Orbit", emoji: "🌍" },
        ],
      },
      {
        title: "Space Explorer",
        emoji: "👨‍🚀",
        pathBadge: "Astronaut path",
        missions: [
          { title: "Design Your Rocket", emoji: "🚀" },
          { title: "Gravity Simulation", emoji: "🌌" },
          { title: "Star Map", emoji: "⭐" },
          { title: "Mission Control", emoji: "🖥️" },
          { title: "Planet Landing", emoji: "🪐" },
          { title: "Alien Discovery", emoji: "👽" },
          { title: "Space Mission Complete", emoji: "🏆" },
          { title: "Build a Water Rocket", emoji: "💧" },
        ],
      },
    ],
  },
  {
    pathId: "doctor",
    label: "Doctor",
    emoji: "🩺",
    packs: [
      {
        title: "Junior Medic Academy",
        emoji: "🏥",
        freeBadge: true,
        missions: [
          { title: "First Day at the Hospital", emoji: "🏥" },
          { title: "Check the Vitals", emoji: "💓" },
          { title: "Alert System", emoji: "🚨" },
          { title: "Treatment Plan", emoji: "💊" },
        ],
      },
      {
        title: "Junior Doctor",
        emoji: "🩺",
        pathBadge: "Doctor path",
        missions: [
          { title: "Design Your Doctor", emoji: "👨‍⚕️" },
          { title: "Body Systems Quiz", emoji: "🫀" },
          { title: "Dissect a Flower", emoji: "🌸" },
          { title: "Heartbeat Analyser", emoji: "📈" },
          { title: "First Aid Guide", emoji: "🩹" },
          { title: "Diagnosis Detective", emoji: "🔬" },
          { title: "Hospital Simulator", emoji: "🏨" },
          { title: "Build a Stethoscope", emoji: "🎧" },
        ],
      },
    ],
  },
];
