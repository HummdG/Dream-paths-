/**
 * Mission Schema & Types
 * 
 * Data-driven mission definitions for the Python game building platform.
 * Missions are defined as pure data, separate from the engine logic.
 */

// =============================================================================
// VALIDATION TYPES
// =============================================================================

export type ValidationCheck = 
  // AST-based checks (static analysis)
  | { type: 'ast_has_assignment'; variable: string }
  | { type: 'ast_has_function'; name: string }
  | { type: 'ast_has_if' }
  | { type: 'ast_has_for_loop' }
  | { type: 'ast_has_while_loop' }
  | { type: 'ast_uses_global'; variable: string }
  | { type: 'ast_calls_function'; name: string; errorHint?: string }
  | { type: 'ast_has_on_key_handler' }

  // Runtime behavior checks
  | { type: 'stdout_contains'; text: string }
  | { type: 'ui_message_shown' }
  | { type: 'player_position_set' }
  | { type: 'player_moves_on_key'; key: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN' }
  | { type: 'player_falls_when_airborne' }
  | { type: 'player_lands_on_platform' }
  | { type: 'player_jumps_on_key'; key: string }
  | { type: 'no_double_jump' }
  | { type: 'platform_count_gte'; count: number }
  | { type: 'coin_collected' }
  | { type: 'score_increments' }
  | { type: 'enemy_moves' }
  | { type: 'enemy_reverses' }
  | { type: 'game_over_on_enemy_collision' }
  | { type: 'level_restarts' }
  | { type: 'win_triggered' }
  
  // Snake runtime checks
  | { type: 'snake_direction_set' }
  | { type: 'snake_food_eaten_check' }

  // Customization checks
  | { type: 'theme_applied' }
  | { type: 'player_sprite_applied' }
  | { type: 'preset_loaded' }
  | { type: 'platforms_modified_from_preset' }
  | { type: 'jump_style_enabled' }
  | { type: 'win_rule_switchable' }
  | { type: 'enemy_behavior_matches_type' }
  
  // Level design checks
  | { type: 'level_has_spawn' }
  | { type: 'level_has_goal' }
  | { type: 'level_has_platforms'; count: number }
  | { type: 'level_saved' }
  
  // Sprite design checks  
  | { type: 'sprite_has_pixels' }
  | { type: 'sprite_saved' }
  | { type: 'enemy_has_behavior' };

export interface ValidationConfig {
  type: 'ast' | 'runtime' | 'ast_and_runtime';
  checks: ValidationCheck[];
}

// =============================================================================
// REWARD TYPES
// =============================================================================

export interface StepReward {
  stars: number;
  badge?: string;
}

// =============================================================================
// STEP TYPES
// =============================================================================

export interface MissionStep {
  stepId: string;
  concepts: string[];
  instruction: string;
  detailedExplanation?: string; // Kid-friendly explanation of the concept
  starterCode: string;
  hint?: string;
  solutionCode?: string; // Gated behind confirmation
  successCriteria: string[];
  validation: ValidationConfig;
  reward: StepReward;
  
  // Customization options for this step
  customization?: {
    type: 'cosmetic' | 'level_design' | 'mechanics' | 'rules';
    description: string;
    options?: string[]; // Available choices
  };
}

// =============================================================================
// MISSION TYPES
// =============================================================================

export interface Mission {
  missionId: string;
  title: string;
  purpose: string;
  storyIntro: string;
  estimatedMinutes: number;
  steps: MissionStep[];
  
  // Learning outcomes for this mission
  learningOutcomes: string[];
  
  // Special mission type (default is 'coding')
  missionType?: 'coding' | 'creative' | 'level_design' | 'sprite_design';

  // Which game engine renders this mission (default = 'platformer')
  engineType?: 'platformer' | 'snake';
}

// =============================================================================
// MISSION PACK TYPES
// =============================================================================

export interface GameTemplateConfig {
  templateId: string;
  name: string;
  
  // Available themes
  themes: ThemeConfig[];
  
  // Player sprite options
  playerSprites: SpriteConfig[];
  
  // Level presets
  levelPresets: LevelPreset[];
  
  // Available mechanics (feature flags)
  availableMechanics: MechanicFlag[];
  
  // Default CONFIG values
  defaultConfig: GameConfig;
}

export interface ThemeConfig {
  id: string;
  name: string;
  background: string;
  platformTile: string;
  coinSprite: string;
  goalSprite: string;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface SpriteConfig {
  id: string;
  name: string;
  spriteSheet: string;
  animations: {
    idle: string;
    walk: string;
    jump: string;
  };
}

export interface LevelPreset {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  platforms: Platform[];
  coins: Position[];
  enemies: EnemyPlacement[];
  goal: Position;
}

export interface MechanicFlag {
  id: string;
  name: string;
  description: string;
  default: boolean;
}

// =============================================================================
// GAME CONFIG TYPES (Kid-facing Python CONFIG section)
// =============================================================================

export interface GameConfig {
  THEME: string;
  PLAYER: {
    sprite: string;
    speed: number;
    jumpStrength: number;
  };
  MECHANICS: {
    doubleJump: boolean;
    dash: boolean;
    timer: boolean;
    lives: number;
  };
  LEVEL: {
    preset: string;
    platforms: Platform[];
    coins: Position[];
    enemies: EnemyPlacement[];
    goal: Position;
  };
  WIN_RULE: {
    type: 'reach_goal' | 'collect_coins';
    target: number;
  };
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface EnemyPlacement {
  type: string;
  x: number;
  y: number;
}

// =============================================================================
// MISSION PACK DEFINITION
// =============================================================================

export interface MissionPack {
  packId: string;
  packTitle: string;
  description: string;
  targetAgeRange: string;
  
  // Template this pack uses
  gameTemplate: GameTemplateConfig;
  
  // All missions in order
  missions: Mission[];
  
  // Overall learning outcomes
  learningOutcomes: string[];
}

// =============================================================================
// PROJECT STATE TYPES (for persistence)
// =============================================================================

export interface ProjectState {
  projectId: string;
  childId: string;
  packId: string;
  
  // Current progress
  currentMissionId: string;
  currentStepId: string;
  
  // User's code per step
  codeByStep: Record<string, string>;
  
  // User's customization config
  gameConfig: GameConfig;
  
  // Completion state
  completedSteps: string[];
  completedMissions: string[];
  
  // Rewards earned
  totalStars: number;
  badges: string[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface CodeSnapshot {
  snapshotId: string;
  projectId: string;
  stepId: string;
  code: string;
  timestamp: Date;
  isAutoSave: boolean;
}

// =============================================================================
// RUNTIME EVENT TYPES (for validation)
// =============================================================================

export type GameEvent = 
  | { type: 'player_position_changed'; x: number; y: number }
  | { type: 'player_jumped' }
  | { type: 'player_landed' }
  | { type: 'player_moved'; direction: 'left' | 'right' }
  | { type: 'key_pressed'; key: string }
  | { type: 'collision'; objectA: string; objectB: string }
  | { type: 'coin_collected'; coinId: string }
  | { type: 'score_changed'; score: number }
  | { type: 'enemy_direction_changed'; enemyId: string; direction: number }
  | { type: 'game_over' }
  | { type: 'level_restart' }
  | { type: 'win' }
  | { type: 'message_shown'; text: string }
  | { type: 'theme_set'; themeId: string }
  | { type: 'sprite_set'; spriteId: string }
  // Snake events
  | { type: 'snake_direction_changed'; direction: string }
  | { type: 'snake_food_eaten'; score: number }
  | { type: 'snake_game_over'; score: number };

