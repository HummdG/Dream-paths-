/**
 * Pack progress utilities.
 *
 * Provides a generalised way to compute completed mission IDs, pack completion,
 * and locked state for any ordered list of MissionPacks. Adding a new game
 * requires no changes here — just add the pack to allMissionPacks.
 */

import type { MissionPack } from './schema';

// Minimal shape we need from the Prisma Project + stepProgress includes.
interface ProjectWithSteps {
  packId: string;
  totalStars: number;
  badgesJson: unknown;
  stepProgress: Array<{
    missionId: string;
    stepId: string;
    status: string;
  }>;
}

export interface PackProgress {
  pack: MissionPack;
  completedMissionIds: string[];
  totalStars: number;
  badges: string[];
  /** true when the previous pack is not yet complete */
  locked: boolean;
  lockedMessage?: string;
}

/**
 * Return the missionIds that have every step marked COMPLETED in the project.
 * Returns [] if project is undefined.
 */
export function getCompletedMissionIds(
  pack: MissionPack,
  project: ProjectWithSteps | undefined
): string[] {
  if (!project) return [];

  const completedSteps = project.stepProgress.filter(sp => sp.status === 'COMPLETED');
  const completedMissionIds: string[] = [];

  for (const mission of pack.missions) {
    const requiredStepIds = mission.steps.map(s => s.stepId);
    const completedStepIds = completedSteps
      .filter(sp => sp.missionId === mission.missionId)
      .map(sp => sp.stepId);

    if (requiredStepIds.every(id => completedStepIds.includes(id))) {
      completedMissionIds.push(mission.missionId);
    }
  }

  return completedMissionIds;
}

/**
 * Returns true when every mission in the pack is complete.
 */
export function isPackComplete(
  pack: MissionPack,
  project: ProjectWithSteps | undefined
): boolean {
  const completed = getCompletedMissionIds(pack, project);
  return completed.length === pack.missions.length;
}

/**
 * Compute PackProgress for every pack in display order.
 *
 * Lock rule: pack[i] is locked when pack[i-1] is not complete. Pack[0] is
 * never locked. Works for any N packs — no hardcoding.
 */
export function computeAllPackProgress(
  packs: MissionPack[],
  projects: ProjectWithSteps[]
): PackProgress[] {
  return packs.map((pack, index) => {
    const project = projects.find(p => p.packId === pack.packId);
    const completedMissionIds = getCompletedMissionIds(pack, project);
    const totalStars = project?.totalStars ?? 0;
    const badges = (project?.badgesJson as string[]) ?? [];

    const locked =
      index > 0 && !isPackComplete(packs[index - 1], projects.find(p => p.packId === packs[index - 1].packId));

    const lockedMessage = locked
      ? `Complete "${packs[index - 1].packTitle}" to unlock this game!`
      : undefined;

    return { pack, completedMissionIds, totalStars, badges, locked, lockedMessage };
  });
}
