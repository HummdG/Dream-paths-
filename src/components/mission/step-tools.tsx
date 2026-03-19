"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Circle, Star, Trophy } from "lucide-react";
import { MissionStep } from "@/lib/missions/schema";
import { ValidationResult } from "@/lib/validation";

interface StepToolsProps {
  step: MissionStep;
  validationResult?: ValidationResult;
  isCompleted: boolean;
}

export function StepTools({ step, validationResult, isCompleted }: StepToolsProps) {
  const allPassed = isCompleted || validationResult?.passed === true;

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm overflow-hidden">

      {/* Top strip: criteria + reward in one row */}
      <div className="px-4 py-3 flex items-start gap-4">

        {/* Success criteria */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Checklist</p>
          <ul className="space-y-1.5">
            {step.successCriteria.map((criterion, i) => {
              const check = validationResult?.checks[i];
              const passed = isCompleted || check?.passed === true;
              return (
                <li key={i} className="flex items-start gap-2 text-xs">
                  {passed
                    ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    : <Circle className="w-3.5 h-3.5 text-gray-300 mt-0.5 shrink-0" />}
                  <span className={passed ? "text-emerald-700 font-medium" : "text-gray-500"}>{criterion}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Stars + badge */}
        <div className="flex flex-col gap-2 shrink-0">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: step.reward.stars }, (_, i) => (
              <Star key={i} className={`w-4 h-4 ${allPassed ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
            ))}
            {step.reward.badge && (
              <span className={`ml-1 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${allPassed ? "bg-violet-100 text-violet-700" : "bg-gray-100 text-gray-400"}`}>
                <Trophy className="w-2.5 h-2.5" /> {step.reward.badge}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Validation result bar */}
      <AnimatePresence>
        {validationResult && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className={`px-4 py-2 border-t text-xs flex items-center gap-2 ${
              validationResult.passed
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-rose-50 border-rose-200 text-rose-700"
            }`}>
              {validationResult.passed
                ? <><CheckCircle className="w-3.5 h-3.5 shrink-0" /> All checks passed!</>
                : <><Circle className="w-3.5 h-3.5 shrink-0" /> {validationResult.checks.filter(c => !c.passed).length} check{validationResult.checks.filter(c => !c.passed).length !== 1 ? "s" : ""} still needed</>
              }
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step complete banner */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-emerald-500 text-white text-xs font-bold px-4 py-2 flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 shrink-0" /> Step Complete! 🎉
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customization options */}
      {step.customization && (
        <div className="px-4 py-3 bg-purple-50 border-t border-purple-200">
          <p className="text-xs font-semibold text-purple-700 mb-1.5">🎨 {step.customization.description}</p>
          {step.customization.options && (
            <div className="flex flex-wrap gap-1.5">
              {step.customization.options.map(option => (
                <span key={option} className="px-2 py-0.5 bg-white border border-purple-200 text-purple-700 rounded-lg text-xs font-mono">{option}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
