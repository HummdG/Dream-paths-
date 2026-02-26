"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ChevronLeft, 
  Lightbulb, 
  CheckCircle, 
  Circle,
  Star,
  Eye,
  EyeOff,
  Trophy
} from "lucide-react";
import { MissionStep } from "@/lib/missions/schema";
import { ValidationResult, CheckResult } from "@/lib/validation";

interface StepPanelProps {
  step: MissionStep;
  stepNumber: number;
  totalSteps: number;
  missionTitle: string;
  validationResult?: ValidationResult;
  isCompleted: boolean;
  onPrevStep?: () => void;
  onNextStep?: () => void;
  hasPrevStep: boolean;
  hasNextStep: boolean;
}

export function StepPanel({
  step,
  stepNumber,
  totalSteps,
  missionTitle,
  validationResult,
  isCompleted,
  onPrevStep,
  onNextStep,
  hasPrevStep,
  hasNextStep
}: StepPanelProps) {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [confirmSolution, setConfirmSolution] = useState(false);

  const handleShowSolution = () => {
    if (!confirmSolution) {
      setConfirmSolution(true);
    } else {
      setShowSolution(true);
      setConfirmSolution(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-violet-200 text-xs font-medium">{missionTitle}</p>
            <h2 className="text-white font-bold">Step {stepNumber} of {totalSteps}</h2>
          </div>
          {isCompleted && (
            <div className="flex items-center gap-1 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Complete!
            </div>
          )}
        </div>
        
        {/* Progress dots */}
        <div className="flex items-center gap-1 mt-3">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i + 1 < stepNumber
                  ? "bg-emerald-400"
                  : i + 1 === stepNumber
                  ? "bg-white"
                  : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Concepts being learned */}
        <div className="flex flex-wrap gap-2">
          {step.concepts.map((concept) => (
            <span
              key={concept}
              className="px-2 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium"
            >
              {concept}
            </span>
          ))}
        </div>

        {/* Main instruction */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200">
          <h3 className="font-bold text-amber-900 mb-2">🎯 Your Goal</h3>
          <p className="text-amber-800 text-lg">{step.instruction}</p>
        </div>

        {/* Detailed explanation */}
        {step.detailedExplanation && (
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">📚 How it works:</h4>
            <p className="text-blue-800 text-sm">{step.detailedExplanation}</p>
          </div>
        )}

        {/* Success criteria */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-medium text-gray-700 mb-3">✅ What you need to do:</h4>
          <ul className="space-y-2">
            {step.successCriteria.map((criterion, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Circle className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <span className="text-gray-600">{criterion}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Validation results */}
        {validationResult && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`rounded-xl p-4 border-2 ${
                validationResult.passed
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-rose-50 border-rose-200"
              }`}
            >
              <h4 className={`font-bold mb-2 ${
                validationResult.passed ? "text-emerald-700" : "text-rose-700"
              }`}>
                {validationResult.passed ? "🎉 Success!" : "🔍 Check your code:"}
              </h4>
              <ul className="space-y-1">
                {validationResult.checks.map((check, i) => (
                  <CheckResultItem key={i} result={check} />
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Hint section */}
        {step.hint && (
          <div className="border border-amber-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setShowHint(!showHint)}
              className="w-full flex items-center justify-between p-3 bg-amber-50 hover:bg-amber-100 transition-colors"
            >
              <span className="flex items-center gap-2 font-medium text-amber-700">
                <Lightbulb className="w-4 h-4" />
                Need a hint?
              </span>
              {showHint ? (
                <EyeOff className="w-4 h-4 text-amber-500" />
              ) : (
                <Eye className="w-4 h-4 text-amber-500" />
              )}
            </button>
            <AnimatePresence>
              {showHint && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="p-3 bg-amber-50/50 text-amber-800 text-sm border-t border-amber-200">
                    💡 {step.hint}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Solution section (gated) */}
        {step.solutionCode && (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={handleShowSolution}
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="flex items-center gap-2 font-medium text-gray-600">
                {showSolution ? "Hide Solution" : "Show Solution"}
              </span>
              {showSolution ? (
                <EyeOff className="w-4 h-4 text-gray-400" />
              ) : (
                <Eye className="w-4 h-4 text-gray-400" />
              )}
            </button>
            <AnimatePresence>
              {confirmSolution && !showSolution && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 bg-rose-50 text-rose-800 text-sm border-t border-gray-200">
                    <p className="mb-2">⚠️ Are you sure? Try the hint first!</p>
                    <button
                      onClick={handleShowSolution}
                      className="text-rose-600 underline text-xs"
                    >
                      Yes, show me the solution
                    </button>
                  </div>
                </motion.div>
              )}
              {showSolution && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <pre className="p-3 bg-slate-900 text-emerald-400 text-xs font-mono overflow-x-auto border-t border-gray-200">
                    {step.solutionCode}
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Reward preview */}
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-200">
          <h4 className="font-medium text-yellow-800 mb-2">🏆 Rewards:</h4>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: step.reward.stars }, (_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    isCompleted ? "text-yellow-400 fill-yellow-400" : "text-yellow-300"
                  }`}
                />
              ))}
            </div>
            {step.reward.badge && (
              <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                isCompleted
                  ? "bg-violet-100 text-violet-700"
                  : "bg-gray-100 text-gray-500"
              }`}>
                <Trophy className="w-3 h-3" />
                {step.reward.badge}
              </span>
            )}
          </div>
        </div>

        {/* Customization info */}
        {step.customization && (
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <h4 className="font-medium text-purple-800 mb-2">🎨 Make it yours!</h4>
            <p className="text-purple-700 text-sm">{step.customization.description}</p>
            {step.customization.options && (
              <div className="flex flex-wrap gap-2 mt-2">
                {step.customization.options.map((option) => (
                  <span
                    key={option}
                    className="px-2 py-1 bg-purple-100 text-purple-600 rounded text-xs"
                  >
                    {option}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation footer */}
      <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between bg-gray-50">
        <button
          onClick={onPrevStep}
          disabled={!hasPrevStep}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-all ${
            hasPrevStep
              ? "text-gray-600 hover:bg-gray-200"
              : "text-gray-300 cursor-not-allowed"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <button
          onClick={onNextStep}
          disabled={!hasNextStep || !isCompleted}
          className={`flex items-center gap-1 px-4 py-2 rounded-lg font-bold transition-all ${
            hasNextStep && isCompleted
              ? "bg-violet-600 text-white hover:bg-violet-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next Step
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function CheckResultItem({ result }: { result: CheckResult }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      {result.passed ? (
        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
      ) : (
        <Circle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
      )}
      <span className={result.passed ? "text-emerald-700" : "text-rose-700"}>
        {result.message}
      </span>
    </li>
  );
}






