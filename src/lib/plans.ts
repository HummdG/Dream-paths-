export const PLANS = {
  FREE: 'free',
  DREAM_STUDIO: 'dream_studio',
} as const

export type PlanId = (typeof PLANS)[keyof typeof PLANS]

/** Pack IDs that are always free regardless of plan or path. */
export const FREE_PACK_IDS = ['snake_basics_v1', 'rocket_basics_v1', 'patient_monitor_basics_v1'];

/** @deprecated Use FREE_PACK_IDS. Kept for backwards compat. */
export const FREE_PACK_ID = 'snake_basics_v1';

/**
 * Maps career path IDs → the game pack IDs they include.
 */
export const PATH_PACKS: Record<string, string[]> = {
  computer_scientist: ['snake_basics_v1', 'platformer_v1'],
  astronaut: ['rocket_basics_v1', 'astronaut_v1'],
  doctor: ['patient_monitor_basics_v1', 'doctor_v1'],
}

/** Display metadata for each career path. */
export interface CareerPathMeta {
  label: string;
  emoji: string;
  /** Tailwind gradient classes e.g. "from-violet-500 to-indigo-600" */
  gradient: string;
  tagline: string;
  description: string;
  /** Short bullet points shown in marketing/slideshow */
  preview: string[];
  /** Hero section background image path */
  heroBackground?: string;
  /** Front-on character image path (detail card / banner) */
  frontOnImage?: string;
  /** Homepage-style character image used in path marketing hero */
  heroCharacterImage?: string;
}

export const CAREER_PATHS: Record<string, CareerPathMeta> = {
  computer_scientist: {
    label: 'Computer Scientist',
    emoji: '💻',
    gradient: 'from-violet-500 to-indigo-600',
    tagline: 'Python through real game-building',
    description: 'Learn to code in Python by building real games from scratch. First, program your own Snake game: moving the snake, eating food, and keeping score. Then create a full Platformer game complete with a pixel-art hero you design, gravity, jumping, enemies, and collectibles.',
    preview: [
      'Program your own Snake game in Python',
      'Build a full Platformer with gravity, enemies & coins',
      'Design a custom pixel-art hero character',
    ],
    heroBackground: '/computer_scientist_hero_background.png',
    frontOnImage: '/programmer.png',
    heroCharacterImage: '/programmer.png',
  },
  astronaut: {
    label: 'Astronaut',
    emoji: '🚀',
    gradient: 'from-indigo-500 to-purple-600',
    tagline: 'Rocket physics, space science & Python',
    description: 'Blast off into coding! Program your own rocket, simulate real gravity and orbits, and run space experiments, all using Python. You\'ll start with the basics of rocket control, then build increasingly complex space simulations as you progress through the Astronaut path.',
    preview: [
      'Program and launch your own rocket in Python',
      'Simulate real gravity and orbital physics',
      'Run experiments and explore the solar system',
    ],
    heroBackground: '/astronaut_hero_background.png',
    frontOnImage: '/rocket.png',
    heroCharacterImage: '/rocket.png',
  },
  doctor: {
    label: 'Doctor',
    emoji: '🩺',
    gradient: 'from-cyan-500 to-teal-600',
    tagline: 'Biology, anatomy & medical science',
    description: 'Step into the hospital and learn biology through code. Build a patient monitor that tracks heart rate and vitals, write a diagnosis system, and create medical tools -- all in Python. Start as a Junior Medic and work your way up to performing digital surgery!',
    preview: [
      'Build a patient monitor that tracks vitals in Python',
      'Write a diagnosis system and treatment planner',
      'Explore biology, anatomy, and medical science',
    ],
    heroBackground: '/doctor_hero_background.png',
    frontOnImage: '/scientist.png',
    heroCharacterImage: '/scientist.png',
  },
}

export function getMaxChildren(planId: PlanId | string | null | undefined): number {
  if (planId === PLANS.DREAM_STUDIO) return Infinity
  return 1
}

// Mission count gating is removed — access is gated entirely by canAccessPack.
// If a user can access a pack, they can complete all missions in it.
export function getMaxMissions(): number {
  return 999
}

/**
 * Returns true when the given pack is accessible.
 * packId: a game pack (e.g. 'platformer_v1')
 * planId: top-level plan ('free' | 'dream_studio')
 * purchasedPathIds: career path IDs the parent has bought (e.g. ['computer_scientist'])
 */
export function canAccessPack(
  packId: string,
  planId: PlanId | string | null | undefined,
  purchasedPathIds: string[] = []
): boolean {
  if (planId === PLANS.DREAM_STUDIO) return true
  if (FREE_PACK_IDS.includes(packId)) return true
  return purchasedPathIds.some(pathId => PATH_PACKS[pathId]?.includes(packId))
}

export const PLAN_FEATURES: Record<string, { maxChildren: number; label: string; price: string }> = {
  dream_studio: { maxChildren: Infinity, label: 'Dream Studio', price: '£39.99/month' },
}
