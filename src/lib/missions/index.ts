/**
 * Missions Module
 *
 * Exports all mission-related types, schemas, and content.
 */

// Schema and types
export * from './schema';

// Pack progress utilities (computeAllPackProgress, computePathPackProgress, etc.)
export * from './progress';

// Mission packs
export {
  platformerMissionPack,
  getMissionById,
  getStepById,
  getNextStep
} from './platformer-pack';

export { snakeMissionPack, getSnakeMissionById } from './snake-pack';
export { rocketMissionPack, getRocketMissionById } from './rocket-pack';
export { astronautMissionPack, getAstronautMissionById } from './astronaut-pack';
export { patientMonitorMissionPack, getPatientMissionById } from './patient-monitor-pack';
export { doctorMissionPack, getDoctorMissionById } from './doctor-pack';

// All packs in display order
import { snakeMissionPack } from './snake-pack';
import { platformerMissionPack } from './platformer-pack';
import { rocketMissionPack } from './rocket-pack';
import { astronautMissionPack } from './astronaut-pack';
import { patientMonitorMissionPack } from './patient-monitor-pack';
import { doctorMissionPack } from './doctor-pack';
import type { MissionPack, Mission } from './schema';

export const allMissionPacks: MissionPack[] = [
  snakeMissionPack,
  platformerMissionPack,
  rocketMissionPack,
  astronautMissionPack,
  patientMonitorMissionPack,
  doctorMissionPack,
];

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
