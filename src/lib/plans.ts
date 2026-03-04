export const PLANS = {
  FREE: 'free',
  FOUNDING_FAMILY: 'founding_family',
  DREAM_STUDIO: 'dream_studio',
} as const

export type PlanId = (typeof PLANS)[keyof typeof PLANS]

export function getMaxChildren(planId: PlanId | string | null | undefined): number {
  if (planId === PLANS.DREAM_STUDIO) return Infinity
  if (planId === PLANS.FOUNDING_FAMILY) return 2
  return 1
}

export function getMaxMissions(planId: PlanId | string | null | undefined): number {
  return planId === PLANS.FREE || !planId ? 2 : 999
}

/**
 * Returns true when the given pack index is accessible on this plan.
 * packIndex is the 0-based position in allMissionPacks order.
 */
export function canAccessPack(packIndex: number, planId: PlanId | string | null | undefined): boolean {
  if (planId === PLANS.DREAM_STUDIO) return true       // all packs
  if (planId === PLANS.FOUNDING_FAMILY) return packIndex < 2 // snake + platformer
  return packIndex < 1                                  // free: snake only
}

export const PLAN_FEATURES: Record<string, { maxChildren: number; label: string; price: string }> = {
  founding_family: { maxChildren: 2, label: 'Founding Family', price: '£24.99/month' },
  dream_studio: { maxChildren: Infinity, label: 'Dream Studio', price: '£39.99/month' },
}
