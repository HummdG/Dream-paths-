"use client";

import Link from "next/link";
import Image from "next/image";
import { Lock, ArrowRight } from "lucide-react";
import type { PackProgress } from "@/lib/missions";
import { CAREER_PATHS, FREE_PACK_IDS } from "@/lib/plans";
import type { CareerPathEntry } from "./career-path-grid";

const DEFAULT_META = {
  label: "Unknown Path",
  emoji: "⭐",
  gradient: "from-blue-500 to-cyan-600",
  tagline: "",
  description: "",
  preview: [] as string[],
};

interface PathCardProps {
  entry: CareerPathEntry;
}

export function PathCard({ entry }: PathCardProps) {
  const { pathId, packsProgress } = entry;
  const meta = CAREER_PATHS[pathId] ?? DEFAULT_META;

  const freePacks = packsProgress.filter((pp) =>
    FREE_PACK_IDS.includes(pp.pack.packId)
  );
  const paidPacks = packsProgress.filter(
    (pp) => !FREE_PACK_IDS.includes(pp.pack.packId)
  );
  const totalCompleted = packsProgress.reduce(
    (sum, pp) => sum + pp.completedMissionIds.length,
    0
  );
  const totalStars = packsProgress.reduce((sum, pp) => sum + pp.totalStars, 0);
  const hasProgress = totalCompleted > 0;

  return (
    <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${meta.gradient} p-5`}>
        {meta.heroBackground && (
          <Image
            src={meta.heroBackground}
            fill
            alt=""
            className="object-cover object-center opacity-20"
          />
        )}
        <div className="relative z-10 flex items-end justify-between">
          <div>
            <h3 className="text-white font-bold text-lg leading-tight">
              {meta.label}
            </h3>
            <p className="text-white/75 text-xs mt-0.5">{meta.tagline}</p>
          </div>
          {meta.frontOnImage && (
            <Image
              src={meta.frontOnImage}
              width={64}
              height={80}
              alt={meta.label}
              className="shrink-0"
              style={{ filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.3))' }}
            />
          )}
        </div>
      </div>

      {/* Body */}
      <div className="bg-white p-4 flex flex-col flex-1 gap-3">
        {freePacks.map((pp) => (
          <PackRow key={pp.pack.packId} pp={pp} isFree />
        ))}
        {paidPacks.map((pp) => (
          <PackRow key={pp.pack.packId} pp={pp} isFree={false} />
        ))}

        <div className="mt-auto pt-2 flex flex-col gap-2">
          <Link
            href={`/path/${pathId}`}
            className={`flex items-center justify-center gap-1.5 w-full py-2.5 rounded-full text-sm font-semibold transition-all ${
              hasProgress
                ? `bg-gradient-to-r ${meta.gradient} text-white hover:opacity-90`
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {hasProgress ? "Continue" : "Start Free"}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

        </div>

        {totalStars > 0 && (
          <p className="text-xs text-gray-400 text-center">
            ⭐ {totalStars} stars earned
          </p>
        )}
      </div>
    </div>
  );
}

function PackRow({
  pp,
  isFree,
}: {
  pp: PackProgress;
  isFree: boolean;
}) {
  const { pack, completedMissionIds, locked, lockReason } = pp;
  const completed = completedMissionIds.length;
  const total = pack.missions.length;
  const percent = total > 0 ? (completed / total) * 100 : 0;
  const isSubLocked = locked && lockReason === "subscription";

  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <div className="flex items-center gap-1.5">
          {isSubLocked && (
            <Lock className="w-3 h-3 text-gray-400" />
          )}
          <span
            className={`font-medium truncate max-w-[120px] ${isSubLocked ? "text-gray-400" : "text-gray-700"}`}
          >
            {pack.packTitle}
          </span>
          {isFree && !isSubLocked && (
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full shrink-0">
              FREE
            </span>
          )}
        </div>
        <span className={isSubLocked ? "text-gray-400" : "text-gray-500"}>
          {isSubLocked ? "Locked" : `${completed}/${total}`}
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        {!isSubLocked && (
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        )}
      </div>
    </div>
  );
}
