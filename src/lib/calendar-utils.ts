import type { StepData } from "@/components/parent-dashboard/child-progress-card";

/**
 * Returns a projected finish Date or null if insufficient data (<2 completed steps).
 * Logic: compute median gap between consecutive completedAt timestamps,
 * then multiply by the number of remaining steps.
 */
export function estimateCompletionDate(steps: StepData[], now: Date): Date | null {
  const completedDates = steps
    .filter((s) => s.status === "COMPLETED" && s.completedAt !== null)
    .map((s) => new Date(s.completedAt!).getTime())
    .sort((a, b) => a - b);

  if (completedDates.length < 2) return null;

  const remainingCount = steps.filter((s) => s.status !== "COMPLETED").length;
  if (remainingCount === 0) return null;

  // Gaps between consecutive completions in ms
  const gaps: number[] = [];
  for (let i = 1; i < completedDates.length; i++) {
    gaps.push(completedDates[i] - completedDates[i - 1]);
  }

  // Median gap
  gaps.sort((a, b) => a - b);
  const mid = Math.floor(gaps.length / 2);
  const medianGap =
    gaps.length % 2 === 0 ? (gaps[mid - 1] + gaps[mid]) / 2 : gaps[mid];

  if (medianGap <= 0) return null;

  const projectedMs = now.getTime() + medianGap * remainingCount;
  return new Date(projectedMs);
}
