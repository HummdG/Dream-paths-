/**
 * Gamification & Rewards System
 * 
 * Keeps kids engaged with:
 * - XP and leveling up
 * - Badges/achievements
 * - Daily streaks
 * - Celebrations and confetti triggers
 */

export interface PlayerProgress {
  totalXp: number;
  level: number;
  xpToNextLevel: number;
  badges: Badge[];
  streak: StreakInfo;
  stats: PlayerStats;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  progress?: number; // 0-100 for badges that require multiple actions
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // ISO date string
  streakFreezeAvailable: boolean;
}

export interface PlayerStats {
  linesOfCodeWritten: number;
  levelsCompleted: number;
  coinsCollected: number;
  gamesCreated: number;
  totalPlayTime: number; // in minutes
  missionsCompleted: number;
}

// XP required for each level (increases each level)
const XP_PER_LEVEL = [
  0,      // Level 1 (starting)
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  800,    // Level 5
  1200,   // Level 6
  1700,   // Level 7
  2300,   // Level 8
  3000,   // Level 9
  4000,   // Level 10 (max for now)
];

// All available badges
export const BADGES: Badge[] = [
  // Coding Milestones
  {
    id: 'first_run',
    name: 'First Run',
    description: 'Run your first Python code',
    icon: '🚀',
    rarity: 'common'
  },
  {
    id: 'hello_world',
    name: 'Hello World!',
    description: 'Print your first message',
    icon: '👋',
    rarity: 'common'
  },
  {
    id: 'variable_master',
    name: 'Variable Master',
    description: 'Create 10 variables',
    icon: '📦',
    rarity: 'rare'
  },
  {
    id: 'loop_legend',
    name: 'Loop Legend',
    description: 'Use your first for loop',
    icon: '🔄',
    rarity: 'common'
  },
  {
    id: 'function_wizard',
    name: 'Function Wizard',
    description: 'Create 5 functions',
    icon: '🔧',
    rarity: 'rare'
  },
  {
    id: 'code_100',
    name: '100 Lines Club',
    description: 'Write 100 lines of code',
    icon: '💯',
    rarity: 'epic'
  },
  
  // Game Building
  {
    id: 'first_game',
    name: 'Game Creator',
    description: 'Load your first game',
    icon: '🎮',
    rarity: 'common'
  },
  {
    id: 'level_designer',
    name: 'Level Architect',
    description: 'Design your first level',
    icon: '🏗️',
    rarity: 'common'
  },
  {
    id: 'enemy_creator',
    name: 'Enemy Designer',
    description: 'Create a custom enemy',
    icon: '👾',
    rarity: 'rare'
  },
  {
    id: 'coin_collector',
    name: 'Treasure Hunter',
    description: 'Collect 100 coins across all games',
    icon: '🪙',
    rarity: 'rare'
  },
  {
    id: 'game_master',
    name: 'Game Master',
    description: 'Complete 5 full games',
    icon: '🏆',
    rarity: 'legendary'
  },
  
  // Streaks
  {
    id: 'streak_3',
    name: 'On a Roll',
    description: '3 day coding streak',
    icon: '🔥',
    rarity: 'common'
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: '7 day coding streak',
    icon: '⚡',
    rarity: 'rare'
  },
  {
    id: 'streak_30',
    name: 'Dedicated Coder',
    description: '30 day coding streak',
    icon: '🌟',
    rarity: 'legendary'
  },
  
  // Learning
  {
    id: 'lesson_complete_1',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: '📖',
    rarity: 'common'
  },
  {
    id: 'all_basics',
    name: 'Python Basics',
    description: 'Complete all basic lessons',
    icon: '🐍',
    rarity: 'epic'
  },
  {
    id: 'no_hints',
    name: 'Independent Coder',
    description: 'Complete a lesson without hints',
    icon: '🧠',
    rarity: 'rare'
  }
];

/**
 * Calculate player level from XP
 */
export function calculateLevel(totalXp: number): { level: number; xpIntoLevel: number; xpToNextLevel: number } {
  let level = 1;
  let remainingXp = totalXp;
  
  for (let i = 1; i < XP_PER_LEVEL.length; i++) {
    const xpNeeded = XP_PER_LEVEL[i] - XP_PER_LEVEL[i - 1];
    if (remainingXp >= xpNeeded) {
      remainingXp -= xpNeeded;
      level = i + 1;
    } else {
      break;
    }
  }
  
  const currentLevelXp = level < XP_PER_LEVEL.length ? XP_PER_LEVEL[level - 1] : XP_PER_LEVEL[XP_PER_LEVEL.length - 1];
  const nextLevelXp = level < XP_PER_LEVEL.length ? XP_PER_LEVEL[level] : XP_PER_LEVEL[XP_PER_LEVEL.length - 1];
  
  return {
    level,
    xpIntoLevel: remainingXp,
    xpToNextLevel: nextLevelXp - currentLevelXp
  };
}

/**
 * Check if streak is still active
 */
export function checkStreak(lastActiveDate: string | null): {
  isActive: boolean;
  shouldIncrement: boolean;
  shouldReset: boolean;
} {
  if (!lastActiveDate) {
    return { isActive: false, shouldIncrement: true, shouldReset: false };
  }
  
  const last = new Date(lastActiveDate);
  const today = new Date();
  
  // Reset time to midnight for comparison
  last.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // Same day - streak active but don't increment
    return { isActive: true, shouldIncrement: false, shouldReset: false };
  } else if (diffDays === 1) {
    // Next day - increment streak!
    return { isActive: true, shouldIncrement: true, shouldReset: false };
  } else {
    // Streak broken
    return { isActive: false, shouldIncrement: true, shouldReset: true };
  }
}

/**
 * Get newly unlocked badges based on stats
 */
export function checkBadgeUnlocks(
  stats: PlayerStats,
  currentBadges: Badge[],
  streak: number
): Badge[] {
  const unlockedIds = new Set(currentBadges.filter(b => b.unlockedAt).map(b => b.id));
  const newBadges: Badge[] = [];
  
  const checks: Array<{ id: string; condition: boolean }> = [
    { id: 'first_run', condition: stats.linesOfCodeWritten > 0 },
    { id: 'hello_world', condition: stats.linesOfCodeWritten >= 1 },
    { id: 'code_100', condition: stats.linesOfCodeWritten >= 100 },
    { id: 'first_game', condition: stats.gamesCreated >= 1 },
    { id: 'level_designer', condition: stats.levelsCompleted >= 1 },
    { id: 'coin_collector', condition: stats.coinsCollected >= 100 },
    { id: 'game_master', condition: stats.gamesCreated >= 5 },
    { id: 'streak_3', condition: streak >= 3 },
    { id: 'streak_7', condition: streak >= 7 },
    { id: 'streak_30', condition: streak >= 30 },
    { id: 'lesson_complete_1', condition: stats.missionsCompleted >= 1 },
    { id: 'all_basics', condition: stats.missionsCompleted >= 5 },
  ];
  
  for (const check of checks) {
    if (check.condition && !unlockedIds.has(check.id)) {
      const badge = BADGES.find(b => b.id === check.id);
      if (badge) {
        newBadges.push({ ...badge, unlockedAt: new Date() });
      }
    }
  }
  
  return newBadges;
}

/**
 * Calculate celebration intensity based on achievement
 */
export type CelebrationLevel = 'small' | 'medium' | 'large' | 'epic';

export function getCelebrationLevel(event: string, value?: number): CelebrationLevel {
  switch (event) {
    case 'code_run':
      return 'small';
    case 'step_complete':
      return 'medium';
    case 'lesson_complete':
      return 'large';
    case 'badge_earned':
      return value && value > 2 ? 'epic' : 'large'; // Rare badges get epic
    case 'level_up':
      return 'epic';
    case 'streak_milestone':
      return value && value >= 7 ? 'epic' : 'large';
    default:
      return 'small';
  }
}

/**
 * Generate encouraging messages based on progress
 */
export function getEncouragingMessage(context: {
  event: string;
  streak?: number;
  level?: number;
  xp?: number;
  badge?: Badge;
}): string {
  const messages: Record<string, string[]> = {
    code_run: [
      "Great job running your code! 🚀",
      "Your code is working! Keep going! 💪",
      "Awesome! You're becoming a real coder! ⭐",
    ],
    step_complete: [
      "Step complete! You're making progress! 🎯",
      "Nice work! On to the next challenge! 💫",
      "You did it! Keep up the great work! 🌟",
    ],
    lesson_complete: [
      "Lesson complete! You're a coding superstar! 🌟",
      "Amazing! You finished the whole lesson! 🎉",
      "Incredible progress! You're learning so fast! 🚀",
    ],
    streak: [
      `${context.streak} day streak! You're on fire! 🔥`,
      `${context.streak} days in a row! Unstoppable! ⚡`,
      `Wow! ${context.streak} day streak! Keep it up! 💪`,
    ],
    level_up: [
      `LEVEL UP! You're now level ${context.level}! 🎮`,
      `Level ${context.level} achieved! You're getting stronger! 💪`,
      `Congratulations on reaching level ${context.level}! 🏆`,
    ],
    badge: [
      `New badge: ${context.badge?.name}! ${context.badge?.icon}`,
      `You earned the ${context.badge?.name} badge! 🏅`,
      `Achievement unlocked: ${context.badge?.name}! ✨`,
    ],
  };
  
  const options = messages[context.event] || messages.code_run;
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Calculate XP bonuses
 */
export function calculateXpWithBonuses(
  baseXp: number,
  streak: number,
  noHints: boolean
): { totalXp: number; bonuses: Array<{ name: string; amount: number }> } {
  const bonuses: Array<{ name: string; amount: number }> = [];
  let totalXp = baseXp;
  
  // Streak bonus (10% per day, max 50%)
  if (streak > 1) {
    const streakBonus = Math.min(Math.floor(baseXp * 0.1 * (streak - 1)), Math.floor(baseXp * 0.5));
    bonuses.push({ name: `${streak} Day Streak`, amount: streakBonus });
    totalXp += streakBonus;
  }
  
  // No hints bonus (25%)
  if (noHints) {
    const noHintBonus = Math.floor(baseXp * 0.25);
    bonuses.push({ name: 'No Hints Used', amount: noHintBonus });
    totalXp += noHintBonus;
  }
  
  return { totalXp, bonuses };
}

/**
 * Format XP display with animation data
 */
export function formatXpGain(xp: number, bonuses: Array<{ name: string; amount: number }>): string {
  let text = `+${xp} XP`;
  if (bonuses.length > 0) {
    text += ' (' + bonuses.map(b => `+${b.amount} ${b.name}`).join(', ') + ')';
  }
  return text;
}

/**
 * Get level title based on level number
 */
export function getLevelTitle(level: number): string {
  const titles = [
    'Beginner Coder',      // 1
    'Code Apprentice',     // 2
    'Python Learner',      // 3
    'Game Builder',        // 4
    'Code Creator',        // 5
    'Digital Artist',      // 6
    'Game Designer',       // 7
    'Code Master',         // 8
    'Python Pro',          // 9
    'Game Developer',      // 10
  ];
  return titles[Math.min(level - 1, titles.length - 1)];
}

/**
 * Create initial player progress
 */
export function createInitialProgress(): PlayerProgress {
  return {
    totalXp: 0,
    level: 1,
    xpToNextLevel: XP_PER_LEVEL[1],
    badges: [],
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: '',
      streakFreezeAvailable: false
    },
    stats: {
      linesOfCodeWritten: 0,
      levelsCompleted: 0,
      coinsCollected: 0,
      gamesCreated: 0,
      totalPlayTime: 0,
      missionsCompleted: 0
    }
  };
}



