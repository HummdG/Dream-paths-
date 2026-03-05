"use client";

import { useState } from "react";
import { CheckCircle2, Circle, CheckCheck, AlertTriangle } from "lucide-react";
import type { ExperimentGuide as ExperimentGuideData } from "@/lib/missions/schema";

interface ExperimentGuideProps {
  title: string;
  experimentGuide: ExperimentGuideData;
  onComplete: () => void;
  isCompleted?: boolean;
}

export function ExperimentGuide({ title, experimentGuide, onComplete, isCompleted = false }: ExperimentGuideProps) {
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(
    isCompleted ? new Set(experimentGuide.steps.map((_, i) => i)) : new Set()
  );

  const allChecked = checkedSteps.size === experimentGuide.steps.length;

  const toggleStep = (index: number) => {
    if (isCompleted) return;
    setCheckedSteps(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 to-orange-400 px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🧪</span>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
          </div>
          <p className="text-amber-100 text-sm">Real-world experiment — tick each step as you complete it</p>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Materials */}
            <div>
              <h2 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                <span>📦</span> You&apos;ll need:
              </h2>
              <ul className="space-y-2">
                {experimentGuide.materials.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps */}
            <div>
              <h2 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                <span>📋</span> Steps:
              </h2>
              <ol className="space-y-3">
                {experimentGuide.steps.map((step, i) => {
                  const checked = checkedSteps.has(i);
                  return (
                    <li
                      key={i}
                      onClick={() => toggleStep(i)}
                      className={`flex items-start gap-3 cursor-pointer rounded-xl p-2 transition-all ${
                        checked
                          ? "bg-green-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {checked ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300 mt-0.5 shrink-0" />
                      )}
                      <span className={`text-sm ${checked ? "text-green-700 line-through decoration-green-400" : "text-gray-700"}`}>
                        <span className="font-medium not-italic no-underline text-gray-500 mr-1">
                          {i + 1}.
                        </span>
                        {step}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* Safety note */}
          {experimentGuide.safetyNote && (
            <div className="mt-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-amber-800 text-sm">
                <span className="font-bold">Safety: </span>
                {experimentGuide.safetyNote}
              </p>
            </div>
          )}

          {/* Mark Complete button */}
          <div className="mt-8 flex justify-center">
            {isCompleted ? (
              <div className="flex items-center gap-2 bg-green-100 text-green-700 font-bold px-8 py-4 rounded-2xl">
                <CheckCheck className="w-5 h-5" />
                Experiment Complete!
              </div>
            ) : (
              <button
                onClick={onComplete}
                disabled={!allChecked}
                className={`flex items-center gap-2 font-bold px-8 py-4 rounded-2xl transition-all ${
                  allChecked
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl hover:scale-105"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <CheckCheck className="w-5 h-5" />
                {allChecked ? "Mark Complete ✓" : `Tick all ${experimentGuide.steps.length} steps to continue`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
