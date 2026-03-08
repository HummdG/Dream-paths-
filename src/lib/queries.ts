import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { allMissionPacks } from "@/lib/missions";

/**
 * Verify a project belongs to a user (by email) using a single JOIN query.
 * Replaces the parent → children → projects traversal used across progress routes.
 */
export async function verifyProjectOwnership(
  projectId: string,
  userEmail: string
) {
  return db.project.findFirst({
    where: {
      id: projectId,
      child: {
        parent: { email: userEmail },
      },
    },
  });
}

export const DASHBOARD_CACHE_TAG = (parentId: string) =>
  `dashboard-${parentId}`;

/**
 * Cached dashboard query. Keyed per parent, tagged for targeted invalidation.
 * Revalidates after 5 minutes as a safety net; mutations bust it immediately
 * via revalidateTag(DASHBOARD_CACHE_TAG(parentId)).
 */
export function getCachedDashboard(parentId: string) {
  const allPackIds = allMissionPacks.map((p) => p.packId);

  return unstable_cache(
    () =>
      db.parent.findUnique({
        where: { id: parentId },
        include: {
          children: {
            include: {
              heroCharacter: true,
              projects: {
                where: { packId: { in: allPackIds } },
                include: { stepProgress: true },
              },
            },
          },
          subscription: true,
          pathSubscriptions: {
            where: { status: "ACTIVE" },
            select: { pathId: true },
          },
        },
      }),
    ["dashboard", parentId],
    { tags: [DASHBOARD_CACHE_TAG(parentId)], revalidate: 300 }
  )();
}
