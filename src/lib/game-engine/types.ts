/**
 * Game Engine Types
 * 
 * Type definitions for the platformer game engine.
 */

// =============================================================================
// GAME OBJECTS
// =============================================================================

export interface GameObject {
  id: string;
  type: 'player' | 'platform' | 'coin' | 'enemy' | 'goal';
  x: number;
  y: number;
  width: number;
  height: number;
  active: boolean;
}

export interface Player extends GameObject {
  type: 'player';
  vx: number;
  vy: number;
  sprite: string;
  isOnGround: boolean;
  facingRight: boolean;
}

export interface Platform extends GameObject {
  type: 'platform';
  tileSprite?: string;
}

export interface Coin extends GameObject {
  type: 'coin';
  collected: boolean;
  sprite?: string;
}

export interface Enemy extends GameObject {
  type: 'enemy';
  enemyType: string;
  direction: number;
  speed: number;
  sprite?: string;
}

export interface Goal extends GameObject {
  type: 'goal';
  sprite?: string;
}

// =============================================================================
// GAME STATE
// =============================================================================

export interface GameState {
  // Objects
  player: Player;
  platforms: Platform[];
  coins: Coin[];
  enemies: Enemy[];
  goal: Goal | null;
  
  // Game stats
  score: number;
  lives: number;
  
  // Game status
  isRunning: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  hasWon: boolean;
  
  // Visual state
  theme: string;
  messageQueue: GameMessage[];
  
  // Physics settings
  gravity: number;
  
  // Input state
  keysPressed: Set<string>;
}

export interface GameMessage {
  id: string;
  text: string;
  duration: number;
  createdAt: number;
}

// =============================================================================
// GAME CONFIG (from Python CONFIG section)
// =============================================================================

export interface GameConfig {
  theme: string;
  playerSprite: string;
  playerSpeed: number;
  jumpStrength: number;
  gravity: number;
  doubleJump: boolean;
  dash: boolean;
  lives: number;
  winRule: 'reach_goal' | 'collect_coins';
  coinsToWin: number;
}

// =============================================================================
// GAME EVENTS (for validation)
// =============================================================================

export type GameEventType = 
  | 'player_moved'
  | 'player_jumped'
  | 'player_landed'
  | 'player_position_set'
  | 'collision'
  | 'coin_collected'
  | 'score_changed'
  | 'enemy_spawned'
  | 'enemy_direction_changed'
  | 'game_over'
  | 'level_restart'
  | 'win'
  | 'message_shown'
  | 'theme_set'
  | 'sprite_set'
  | 'platform_added'
  | 'goal_added';

export interface GameEvent {
  type: GameEventType;
  timestamp: number;
  data: Record<string, unknown>;
}

// =============================================================================
// THEME ASSETS
// =============================================================================

export interface ThemeAssets {
  background: string;
  platformTile: string;
  playerSprites: Record<string, string>;
  coinSprite: string;
  goalSprite: string;
  enemySprites: Record<string, string>;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
  };
}

// =============================================================================
// ENGINE CALLBACKS
// =============================================================================

export type UpdateCallback = () => void;
export type KeyCallback = () => void;

export interface EngineCallbacks {
  onUpdate: UpdateCallback[];
  onKeyDown: Map<string, KeyCallback[]>;
  onKeyUp: Map<string, KeyCallback[]>;
}

