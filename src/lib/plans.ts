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
}

export const CAREER_PATHS: Record<string, CareerPathMeta> = {
  computer_scientist: {
    label: 'Computer Scientist',
    emoji: '💻',
    gradient: 'from-violet-500 to-indigo-600',
    tagline: 'Python through real game-building',
    description: 'Learn Python by building a Snake game and a Platformer from scratch.',
    preview: [
      'Snake Tutorial (free · 4 missions)',
      'Platformer Game (8 missions)',
      'Pixel art hero creator',
    ],
  },
  astronaut: {
    label: 'Astronaut',
    emoji: '🚀',
    gradient: 'from-indigo-500 to-purple-600',
    tagline: 'Rocket physics, space science & Python',
    description: 'Code rockets, explore orbits, and run space experiments with Python.',
    preview: [
      'Space Cadet Program (free · 4 missions)',
      'Space Explorer (8 missions)',
      'Physics simulations & experiments',
    ],
  },
  doctor: {
    label: 'Doctor',
    emoji: '🩺',
    gradient: 'from-cyan-500 to-teal-600',
    tagline: 'Biology, anatomy & medical science',
    description: 'Diagnose patients, monitor vitals, and learn biology through coding.',
    preview: [
      'Junior Medic Academy (free · 4 missions)',
      'Junior Doctor (8 missions)',
      'Patient monitor simulator',
    ],
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
