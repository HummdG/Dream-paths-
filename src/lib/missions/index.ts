/**
 * Missions Module
 *
 * Exports all mission-related types, schemas, and content.
 */

// Schema and types
export * from './schema';

// Mission packs
export {
  platformerMissionPack,
  getMissionById,
  getStepById,
  getNextStep
} from './platformer-pack';

export { snakeMissionPack, getSnakeMissionById } from './snake-pack';

// All packs in display order: snake first (gateway), platformer second (unlocked after snake)
import { snakeMissionPack } from './snake-pack';
import { platformerMissionPack } from './platformer-pack';
import type { MissionPack, Mission } from './schema';

export const allMissionPacks: MissionPack[] = [snakeMissionPack, platformerMissionPack];

/**
 * Find a mission by ID across all packs.
 * Returns the containing pack and the mission, or undefined if not found.
 */
export function getMissionFromAnyPack(
  missionId: string
): { pack: MissionPack; mission: Mission } | undefined {
  for (const pack of allMissionPacks) {
    const mission = pack.missions.find(m => m.missionId === missionId);
    if (mission) return { pack, mission };
  }
  return undefined;
}
