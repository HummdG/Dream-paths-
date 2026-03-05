"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
  ChevronDown,
  ChevronRight,
  Star,
  CheckCircle2,
  Circle,
  PlayCircle,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Types (serialisable — ISO strings, not Dates)
// ─────────────────────────────────────────────────────────────────────────────

export interface StepData {
  stepId: string;
  instruction: string;
  concepts: string[];
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  starsEarned: number;
  runCount: number;
  hintViews: number;
  completedAt: string | null;
}

export interface MissionData {
  missionId: string;
  title: string;
  steps: StepData[];
}

export interface PackData {
  packId: string;
  packTitle: string;
  emoji: string;
  missions: MissionData[];
  totalStars: number;
  lastActiveAt: string | null;
}

export interface ChildData {
  childId: string;
  firstName: string;
  age: number;
  totalStars: number;
  heroPixels: string[][] | null;
  packs: PackData[];
}

// ─────────────────────────────────────────────────────────────────────────────
// StepRow
// ─────────────────────────────────────────────────────────────────────────────

function StepRow({ step }: { step: StepData }) {
  const statusIcon =
    step.status === "COMPLETED" ? (
      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
    ) : step.status === "IN_PROGRESS" ? (
      <PlayCircle className="w-4 h-4 text-violet-500 shrink-0" />
    ) : (
      <Circle className="w-4 h-4 text-gray-300 shrink-0" />
    );

  return (
    <div className="flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-gray-50">
      <div className="mt-0.5">{statusIcon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 leading-snug">{step.instruction}</p>
        <div className="flex flex-wrap items-center gap-2 mt-1">
          {step.concepts.map((c) => (
            <span
              key={c}
              className="text-xs bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full"
            >
              {c}
            </span>
          ))}
          {step.status === "COMPLETED" && (
            <span className="text-xs text-gray-400 ml-auto shrink-0">
              {step.starsEarned > 0 && (
                <span className="text-amber-500 mr-1">
                  {"⭐".repeat(step.starsEarned)}
                </span>
              )}
              {step.runCount} run{step.runCount !== 1 ? "s" : ""}
              {step.hintViews > 0 && ` · ${step.hintViews} hint${step.hintViews !== 1 ? "s" : ""}`}
              {step.completedAt && (
                <> · {formatDistanceToNow(new Date(step.completedAt), { addSuffix: true })}</>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MissionAccordion
// ─────────────────────────────────────────────────────────────────────────────

function MissionAccordion({ mission }: { mission: MissionData }) {
  const completedCount = mission.steps.filter((s) => s.status === "COMPLETED").length;
  const inProgress = mission.steps.some((s) => s.status === "IN_PROGRESS");
  const defaultOpen = inProgress || (completedCount > 0 && completedCount < mission.steps.length);
  const [open, setOpen] = useState(defaultOpen);

  const progressPct = Math.round((completedCount / mission.steps.length) * 100);

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden mb-2">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <ChevronDown
          className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? "" : "-rotate-90"}`}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800">{mission.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-400 rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 shrink-0">
              {completedCount}/{mission.steps.length} steps
            </span>
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="steps"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="px-2 pb-2 bg-white border-t border-gray-50">
              {mission.steps.map((step) => (
                <StepRow key={step.stepId} step={step} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PackSection
// ─────────────────────────────────────────────────────────────────────────────

function PackSection({ pack }: { pack: PackData }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 mb-2 text-left group"
      >
        <span className="text-lg">{pack.emoji}</span>
        <span className="font-bold text-gray-800 group-hover:text-violet-700 transition-colors">
          {pack.packTitle}
        </span>
        <span className="text-xs text-amber-500 font-medium ml-1">
          ⭐ {pack.totalStars}
        </span>
        {pack.lastActiveAt && (
          <span className="text-xs text-gray-400 ml-auto shrink-0">
            Active {formatDistanceToNow(new Date(pack.lastActiveAt), { addSuffix: true })}
          </span>
        )}
        <ChevronRight
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="missions"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            {pack.missions.map((mission) => (
              <MissionAccordion key={mission.missionId} mission={mission} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ChildProgressCard
// ─────────────────────────────────────────────────────────────────────────────

export function ChildProgressCard({ child }: { child: ChildData }) {
  const completedMissions = child.packs.flatMap((p) =>
    p.missions.filter((m) => m.steps.every((s) => s.status === "COMPLETED"))
  ).length;
  const totalMissions = child.packs.flatMap((p) => p.missions).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Child header */}
      <div className="flex items-center gap-4 p-5 border-b border-gray-50">
        {/* Hero pixel art */}
        <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
          {child.heroPixels ? (
            <div
              className="grid"
              style={{ gridTemplateColumns: "repeat(16, 3.5px)", imageRendering: "pixelated" }}
            >
              {child.heroPixels.map((row, y) =>
                row.map((color, x) => (
                  <div
                    key={`${x}-${y}`}
                    style={{
                      width: 3.5,
                      height: 3.5,
                      backgroundColor: color === "transparent" ? "transparent" : color,
                    }}
                  />
                ))
              )}
            </div>
          ) : (
            <span className="text-2xl">🎨</span>
          )}
        </div>

        {/* Name + stats */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-gray-900">{child.firstName}</h3>
          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            <span className="text-sm text-gray-500">Age {child.age}</span>
            <span className="text-sm text-amber-500 font-medium flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {child.totalStars} stars
            </span>
            <span className="text-sm text-gray-500">
              {completedMissions}/{totalMissions} missions done
            </span>
          </div>
        </div>
      </div>

      {/* Pack sections */}
      <div className="p-5">
        {child.packs.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            No activity yet — {child.firstName} hasn&apos;t started any missions.
          </p>
        ) : (
          child.packs.map((pack) => <PackSection key={pack.packId} pack={pack} />)
        )}
      </div>
    </div>
  );
}
