export const PLANS = {
  FREE: 'free',
  DREAM_STUDIO: 'dream_studio',
} as const

export type PlanId = (typeof PLANS)[keyof typeof PLANS]

export const FREE_PACK_ID = 'snake_basics_v1'

/**
 * Maps career path IDs → the game pack IDs they include.
 * Add new paths here as they launch.
 */
export const PATH_PACKS: Record<string, string[]> = {
  computer_scientist: ['snake_basics_v1', 'platformer_v1'],
  // astronaut: ['astronaut_v1'],    // future
  // ai_engineer: ['ai_basics_v1'], // future
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
  if (packId === FREE_PACK_ID) return true
  return purchasedPathIds.some(pathId => PATH_PACKS[pathId]?.includes(packId))
}

export const PLAN_FEATURES: Record<string, { maxChildren: number; label: string; price: string }> = {
  dream_studio: { maxChildren: Infinity, label: 'Dream Studio', price: '£39.99/month' },
}
