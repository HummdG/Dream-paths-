/**
 * Level Templates
 * 
 * Pre-designed level templates for inspiration in the Level Designer.
 * Each template includes themed platforms, decorations, enemies, and styling.
 */

export interface LevelTemplate {
  id: string;
  name: string;
  theme: ThemeId;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  thumbnail?: string;
  platforms: PlatformData[];
  decorations: DecorationData[];
  enemies: EnemyData[];
  coins: PositionData[];
  playerSpawn: PositionData;
  goal: PositionData;
  settings: LevelSettings;
}

export interface PlatformData {
  x: number;
  y: number;
  width: number;
  height: number;
  type: "solid" | "moving" | "breakable" | "bouncy";
  movePattern?: "horizontal" | "vertical";
  moveRange?: number;
}

export interface DecorationData {
  x: number;
  y: number;
  type: string;
  layer: "background" | "foreground";
}

export interface EnemyData {
  x: number;
  y: number;
  type: "slime" | "bat" | "robot" | "ghost" | "fish" | "fire";
  behavior: "patrol" | "chase" | "jump" | "fly" | "stationary";
  patrolRange?: number;
}

export interface PositionData {
  x: number;
  y: number;
}

export interface LevelSettings {
  winCondition: "reach_goal" | "collect_all_coins" | "defeat_all_enemies" | "survive_time";
  timeLimit?: number;
  requiredCoins?: number;
  backgroundMusic?: string;
}

export type ThemeId = "space" | "jungle" | "city" | "ocean" | "castle" | "sky" | "volcano" | "candy";

// Theme configurations
export interface ThemeConfig {
  id: ThemeId;
  name: string;
  icon: string;
  backgroundColor: string;
  platformColor: string;
  platformAccent: string;
  decorations: string[];
  enemies: string[];
  music: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  space: {
    id: "space",
    name: "Space Station",
    icon: "🚀",
    backgroundColor: "#0d0d1a",
    platformColor: "#2a2a4a",
    platformAccent: "#4a4a6a",
    decorations: ["star", "planet", "asteroid", "satellite"],
    enemies: ["alien", "robot", "drone"],
    music: "space_ambient",
  },
  jungle: {
    id: "jungle",
    name: "Jungle Adventure",
    icon: "🌴",
    backgroundColor: "#1a2f1a",
    platformColor: "#4a7c40",
    platformAccent: "#68d391",
    decorations: ["tree", "vine", "flower", "bush"],
    enemies: ["snake", "spider", "monkey"],
    music: "jungle_beat",
  },
  city: {
    id: "city",
    name: "City Rooftops",
    icon: "🏙️",
    backgroundColor: "#1a1a2a",
    platformColor: "#666666",
    platformAccent: "#888888",
    decorations: ["window", "antenna", "pipe", "sign"],
    enemies: ["pigeon", "robot", "drone"],
    music: "city_groove",
  },
  ocean: {
    id: "ocean",
    name: "Underwater Ruins",
    icon: "🐠",
    backgroundColor: "#0a2a4a",
    platformColor: "#4a8080",
    platformAccent: "#60a0a0",
    decorations: ["coral", "seaweed", "bubble", "shell"],
    enemies: ["fish", "jellyfish", "crab"],
    music: "ocean_calm",
  },
  castle: {
    id: "castle",
    name: "Castle Escape",
    icon: "🏰",
    backgroundColor: "#1a1a1a",
    platformColor: "#4a4a4a",
    platformAccent: "#6a6a6a",
    decorations: ["torch", "banner", "armor", "chain"],
    enemies: ["ghost", "skeleton", "bat"],
    music: "castle_mystery",
  },
  sky: {
    id: "sky",
    name: "Cloud Kingdom",
    icon: "☁️",
    backgroundColor: "#87CEEB",
    platformColor: "#ffffff",
    platformAccent: "#e0e0e0",
    decorations: ["rainbow", "sun", "bird", "balloon"],
    enemies: ["bird", "bee", "cloud_monster"],
    music: "sky_peaceful",
  },
  volcano: {
    id: "volcano",
    name: "Volcano Run",
    icon: "🌋",
    backgroundColor: "#2a1a0a",
    platformColor: "#4a3020",
    platformAccent: "#6a4030",
    decorations: ["lava_pool", "rock", "steam", "crystal"],
    enemies: ["fire_slime", "lava_bat", "rock_monster"],
    music: "volcano_intense",
  },
  candy: {
    id: "candy",
    name: "Candy Land",
    icon: "🍭",
    backgroundColor: "#ffe4f0",
    platformColor: "#ff9ec4",
    platformAccent: "#ffb4d4",
    decorations: ["lollipop", "candy_cane", "cupcake", "gummy"],
    enemies: ["gummy_bear", "candy_snake", "chocolate_bat"],
    music: "candy_happy",
  },
};

// =============================================================================
// LEVEL TEMPLATES
// =============================================================================

export const LEVEL_TEMPLATES: LevelTemplate[] = [
  // SPACE STATION
  {
    id: "space_station_1",
    name: "Space Station Alpha",
    theme: "space",
    description: "Float through the space station and reach the portal!",
    difficulty: "easy",
    platforms: [
      { x: 0, y: 22, width: 8, height: 2, type: "solid" },
      { x: 12, y: 20, width: 6, height: 2, type: "solid" },
      { x: 22, y: 18, width: 5, height: 2, type: "solid" },
      { x: 30, y: 16, width: 8, height: 2, type: "solid" },
    ],
    decorations: [
      { x: 5, y: 5, type: "star", layer: "background" },
      { x: 15, y: 8, type: "planet", layer: "background" },
      { x: 25, y: 3, type: "star", layer: "background" },
      { x: 35, y: 10, type: "satellite", layer: "background" },
    ],
    enemies: [
      { x: 14, y: 18, type: "robot", behavior: "patrol", patrolRange: 4 },
    ],
    coins: [
      { x: 4, y: 20 },
      { x: 14, y: 18 },
      { x: 24, y: 16 },
      { x: 34, y: 14 },
    ],
    playerSpawn: { x: 2, y: 20 },
    goal: { x: 36, y: 14 },
    settings: {
      winCondition: "reach_goal",
    },
  },

  // JUNGLE ADVENTURE
  {
    id: "jungle_adventure_1",
    name: "Jungle Trek",
    theme: "jungle",
    description: "Swing through the vines and avoid the snakes!",
    difficulty: "easy",
    platforms: [
      { x: 0, y: 22, width: 10, height: 3, type: "solid" },
      { x: 14, y: 20, width: 6, height: 2, type: "solid" },
      { x: 24, y: 18, width: 6, height: 2, type: "solid" },
      { x: 34, y: 20, width: 6, height: 3, type: "solid" },
    ],
    decorations: [
      { x: 2, y: 10, type: "tree", layer: "background" },
      { x: 10, y: 8, type: "vine", layer: "foreground" },
      { x: 20, y: 5, type: "tree", layer: "background" },
      { x: 30, y: 12, type: "flower", layer: "foreground" },
    ],
    enemies: [
      { x: 16, y: 18, type: "slime", behavior: "patrol", patrolRange: 4 },
    ],
    coins: [
      { x: 5, y: 20 },
      { x: 16, y: 18 },
      { x: 26, y: 16 },
      { x: 36, y: 18 },
    ],
    playerSpawn: { x: 2, y: 19 },
    goal: { x: 38, y: 18 },
    settings: {
      winCondition: "reach_goal",
    },
  },

  // CITY ROOFTOPS
  {
    id: "city_rooftops_1",
    name: "Rooftop Chase",
    theme: "city",
    description: "Jump across the buildings to escape!",
    difficulty: "medium",
    platforms: [
      { x: 0, y: 22, width: 6, height: 3, type: "solid" },
      { x: 10, y: 20, width: 5, height: 5, type: "solid" },
      { x: 18, y: 18, width: 4, height: 7, type: "solid" },
      { x: 26, y: 16, width: 5, height: 9, type: "solid" },
      { x: 34, y: 14, width: 6, height: 11, type: "solid" },
    ],
    decorations: [
      { x: 3, y: 18, type: "antenna", layer: "foreground" },
      { x: 12, y: 16, type: "window", layer: "background" },
      { x: 20, y: 14, type: "pipe", layer: "foreground" },
      { x: 28, y: 12, type: "sign", layer: "foreground" },
    ],
    enemies: [
      { x: 12, y: 18, type: "robot", behavior: "patrol", patrolRange: 3 },
      { x: 28, y: 14, type: "bat", behavior: "fly", patrolRange: 4 },
    ],
    coins: [
      { x: 3, y: 20 },
      { x: 12, y: 18 },
      { x: 20, y: 16 },
      { x: 28, y: 14 },
      { x: 36, y: 12 },
    ],
    playerSpawn: { x: 2, y: 19 },
    goal: { x: 38, y: 12 },
    settings: {
      winCondition: "reach_goal",
    },
  },

  // UNDERWATER RUINS
  {
    id: "ocean_ruins_1",
    name: "Sunken Temple",
    theme: "ocean",
    description: "Explore the ancient underwater ruins!",
    difficulty: "medium",
    platforms: [
      { x: 0, y: 22, width: 8, height: 2, type: "solid" },
      { x: 10, y: 20, width: 4, height: 2, type: "bouncy" },
      { x: 18, y: 18, width: 6, height: 2, type: "solid" },
      { x: 28, y: 16, width: 4, height: 2, type: "bouncy" },
      { x: 34, y: 20, width: 6, height: 2, type: "solid" },
    ],
    decorations: [
      { x: 4, y: 10, type: "coral", layer: "background" },
      { x: 15, y: 8, type: "seaweed", layer: "foreground" },
      { x: 25, y: 5, type: "bubble", layer: "foreground" },
      { x: 36, y: 12, type: "shell", layer: "background" },
    ],
    enemies: [
      { x: 12, y: 18, type: "fish", behavior: "patrol", patrolRange: 6 },
      { x: 30, y: 14, type: "fish", behavior: "fly", patrolRange: 4 },
    ],
    coins: [
      { x: 4, y: 20 },
      { x: 12, y: 18 },
      { x: 20, y: 16 },
      { x: 30, y: 14 },
      { x: 36, y: 18 },
    ],
    playerSpawn: { x: 2, y: 20 },
    goal: { x: 38, y: 18 },
    settings: {
      winCondition: "collect_all_coins",
      requiredCoins: 5,
    },
  },

  // CASTLE ESCAPE
  {
    id: "castle_escape_1",
    name: "Haunted Halls",
    theme: "castle",
    description: "Escape the haunted castle before the ghosts catch you!",
    difficulty: "hard",
    platforms: [
      { x: 0, y: 22, width: 6, height: 2, type: "solid" },
      { x: 8, y: 20, width: 3, height: 2, type: "breakable" },
      { x: 14, y: 18, width: 4, height: 2, type: "solid" },
      { x: 20, y: 16, width: 3, height: 2, type: "breakable" },
      { x: 26, y: 18, width: 4, height: 2, type: "solid" },
      { x: 34, y: 20, width: 6, height: 2, type: "solid" },
    ],
    decorations: [
      { x: 3, y: 12, type: "torch", layer: "foreground" },
      { x: 16, y: 10, type: "banner", layer: "background" },
      { x: 28, y: 8, type: "armor", layer: "background" },
      { x: 36, y: 14, type: "chain", layer: "foreground" },
    ],
    enemies: [
      { x: 10, y: 18, type: "ghost", behavior: "chase" },
      { x: 22, y: 14, type: "bat", behavior: "fly", patrolRange: 5 },
      { x: 32, y: 18, type: "ghost", behavior: "patrol", patrolRange: 4 },
    ],
    coins: [
      { x: 3, y: 20 },
      { x: 10, y: 18 },
      { x: 16, y: 16 },
      { x: 22, y: 14 },
      { x: 28, y: 16 },
      { x: 36, y: 18 },
    ],
    playerSpawn: { x: 2, y: 20 },
    goal: { x: 38, y: 18 },
    settings: {
      winCondition: "reach_goal",
      timeLimit: 60,
    },
  },

  // CLOUD KINGDOM
  {
    id: "cloud_kingdom_1",
    name: "Fluffy Paradise",
    theme: "sky",
    description: "Bounce on the clouds to reach the rainbow!",
    difficulty: "easy",
    platforms: [
      { x: 0, y: 22, width: 6, height: 2, type: "solid" },
      { x: 10, y: 20, width: 5, height: 2, type: "bouncy" },
      { x: 18, y: 18, width: 5, height: 2, type: "bouncy" },
      { x: 26, y: 16, width: 5, height: 2, type: "bouncy" },
      { x: 34, y: 18, width: 6, height: 2, type: "solid" },
    ],
    decorations: [
      { x: 5, y: 5, type: "sun", layer: "background" },
      { x: 15, y: 8, type: "rainbow", layer: "background" },
      { x: 25, y: 10, type: "bird", layer: "foreground" },
      { x: 35, y: 6, type: "balloon", layer: "foreground" },
    ],
    enemies: [
      { x: 20, y: 16, type: "bat", behavior: "fly", patrolRange: 5 },
    ],
    coins: [
      { x: 3, y: 20 },
      { x: 12, y: 16 },
      { x: 20, y: 14 },
      { x: 28, y: 12 },
      { x: 36, y: 16 },
    ],
    playerSpawn: { x: 2, y: 20 },
    goal: { x: 38, y: 16 },
    settings: {
      winCondition: "reach_goal",
    },
  },

  // VOLCANO RUN
  {
    id: "volcano_run_1",
    name: "Lava Escape",
    theme: "volcano",
    description: "Run fast! The lava is rising!",
    difficulty: "hard",
    platforms: [
      { x: 0, y: 22, width: 5, height: 2, type: "solid" },
      { x: 7, y: 20, width: 4, height: 2, type: "solid" },
      { x: 14, y: 18, width: 4, height: 2, type: "moving", movePattern: "vertical", moveRange: 3 },
      { x: 22, y: 16, width: 4, height: 2, type: "solid" },
      { x: 28, y: 18, width: 4, height: 2, type: "moving", movePattern: "horizontal", moveRange: 4 },
      { x: 36, y: 16, width: 4, height: 2, type: "solid" },
    ],
    decorations: [
      { x: 5, y: 24, type: "lava_pool", layer: "foreground" },
      { x: 12, y: 24, type: "lava_pool", layer: "foreground" },
      { x: 20, y: 24, type: "lava_pool", layer: "foreground" },
      { x: 30, y: 24, type: "lava_pool", layer: "foreground" },
      { x: 15, y: 8, type: "rock", layer: "background" },
      { x: 25, y: 5, type: "steam", layer: "foreground" },
    ],
    enemies: [
      { x: 9, y: 18, type: "fire", behavior: "stationary" },
      { x: 24, y: 14, type: "fire", behavior: "stationary" },
    ],
    coins: [
      { x: 2, y: 20 },
      { x: 9, y: 18 },
      { x: 16, y: 14 },
      { x: 24, y: 14 },
      { x: 30, y: 16 },
      { x: 38, y: 14 },
    ],
    playerSpawn: { x: 2, y: 20 },
    goal: { x: 38, y: 14 },
    settings: {
      winCondition: "reach_goal",
      timeLimit: 45,
    },
  },

  // CANDY LAND
  {
    id: "candy_land_1",
    name: "Sweet Dreams",
    theme: "candy",
    description: "Collect all the candy coins in this sweet world!",
    difficulty: "easy",
    platforms: [
      { x: 0, y: 22, width: 8, height: 2, type: "solid" },
      { x: 12, y: 20, width: 6, height: 2, type: "bouncy" },
      { x: 22, y: 18, width: 6, height: 2, type: "bouncy" },
      { x: 32, y: 20, width: 8, height: 2, type: "solid" },
    ],
    decorations: [
      { x: 4, y: 10, type: "lollipop", layer: "background" },
      { x: 15, y: 8, type: "cupcake", layer: "background" },
      { x: 25, y: 6, type: "candy_cane", layer: "foreground" },
      { x: 36, y: 12, type: "gummy", layer: "foreground" },
    ],
    enemies: [
      { x: 14, y: 18, type: "slime", behavior: "patrol", patrolRange: 4 },
    ],
    coins: [
      { x: 4, y: 20 },
      { x: 8, y: 18 },
      { x: 14, y: 18 },
      { x: 18, y: 16 },
      { x: 24, y: 16 },
      { x: 28, y: 14 },
      { x: 34, y: 18 },
      { x: 38, y: 16 },
    ],
    playerSpawn: { x: 2, y: 20 },
    goal: { x: 38, y: 18 },
    settings: {
      winCondition: "collect_all_coins",
      requiredCoins: 8,
    },
  },
];

// Helper to get templates by theme
export function getTemplatesByTheme(theme: ThemeId): LevelTemplate[] {
  return LEVEL_TEMPLATES.filter((t) => t.theme === theme);
}

// Helper to get templates by difficulty
export function getTemplatesByDifficulty(
  difficulty: "easy" | "medium" | "hard"
): LevelTemplate[] {
  return LEVEL_TEMPLATES.filter((t) => t.difficulty === difficulty);
}

// Helper to get a random template
export function getRandomTemplate(): LevelTemplate {
  return LEVEL_TEMPLATES[Math.floor(Math.random() * LEVEL_TEMPLATES.length)];
}

// Create an empty level with a theme
export function createEmptyLevel(theme: ThemeId, name: string): LevelTemplate {
  return {
    id: `custom_${Date.now()}`,
    name,
    theme,
    description: "My custom level",
    difficulty: "easy",
    platforms: [
      { x: 0, y: 22, width: 40, height: 3, type: "solid" }, // Ground
    ],
    decorations: [],
    enemies: [],
    coins: [],
    playerSpawn: { x: 2, y: 20 },
    goal: { x: 37, y: 20 },
    settings: {
      winCondition: "reach_goal",
    },
  };
}






