"use client";

import { useState, useEffect } from "react";
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle, 
  Circle,
  BookOpen,
  Code,
  Rocket,
  Lightbulb,
  Target
} from "lucide-react";
import { PythonEditor } from "./python-editor";
import { GameCanvas } from "./game-canvas";

export interface LessonStepData {
  id: string;
  title: string;
  type: "intro" | "concept" | "code" | "challenge" | "summary";
  content: string;
  codeTemplate?: string;
  expectedOutput?: string;
  hint?: string;
  conceptExplanation?: string;
  showGamePreview?: boolean;
}

interface LessonStepProps {
  step: LessonStepData;
  stepNumber: number;
  totalSteps: number;
  isCompleted: boolean;
  savedCode?: string;
  onCodeChange?: (code: string) => void;
  onComplete: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  canGoNext: boolean;
}

const stepIcons = {
  intro: BookOpen,
  concept: Lightbulb,
  code: Code,
  challenge: Target,
  summary: Rocket,
};

const stepColors = {
  intro: "from-sky-500 to-blue-500",
  concept: "from-amber-500 to-orange-500",
  code: "from-violet-500 to-purple-500",
  challenge: "from-emerald-500 to-green-500",
  summary: "from-pink-500 to-rose-500",
};

export function LessonStep({
  step,
  stepNumber,
  totalSteps,
  isCompleted,
  savedCode,
  onCodeChange,
  onComplete,
  onPrevious,
  onNext,
  canGoNext,
}: LessonStepProps) {
  const [code, setCode] = useState(savedCode || step.codeTemplate || "");
  const [stepCompleted, setStepCompleted] = useState(isCompleted);

  // Update code when savedCode changes
  useEffect(() => {
    if (savedCode) {
      setCode(savedCode);
    } else if (step.codeTemplate) {
      setCode(step.codeTemplate);
    }
  }, [savedCode, step.codeTemplate]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  const handleCodeSuccess = () => {
    setStepCompleted(true);
    onComplete();
  };

  const Icon = stepIcons[step.type] || BookOpen;
  const gradientColor = stepColors[step.type] || "from-gray-500 to-gray-600";

  // Check if this is a code step that needs validation
  const needsCodeValidation = step.type === "code" || step.type === "challenge";
  const canProceed = !needsCodeValidation || stepCompleted || isCompleted;

  // Debug log
  console.log("LessonStep rendering:", { stepType: step.type, title: step.title });

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradientColor} flex items-center justify-center text-white shadow-lg`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Step {stepNumber} of {totalSteps}</p>
            <h2 className="text-xl font-bold text-[var(--color-navy)]">{step.title}</h2>
          </div>
        </div>
        
        {(stepCompleted || isCompleted) && (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium text-sm">Complete!</span>
          </div>
        )}
      </div>

      {/* Progress Dots */}
      <div className="flex items-center gap-2 justify-center py-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              i < stepNumber - 1
                ? "bg-green-500"
                : i === stepNumber - 1
                ? "bg-violet-500 scale-125"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="card">
        {/* Main content - formatted with markdown-like rendering */}
        <div className="prose prose-lg max-w-none">
          {step.content.split("\n\n").map((paragraph, i) => {
            // Check for code blocks in content
            if (paragraph.startsWith("```")) {
              const codeContent = paragraph.replace(/```python?\n?/g, "").replace(/```/g, "");
              return (
                <pre key={i} className="bg-slate-800 text-white p-4 rounded-xl text-sm overflow-x-auto">
                  <code>{codeContent}</code>
                </pre>
              );
            }
            
            // Check for bullet points
            if (paragraph.includes("\n- ")) {
              const [intro, ...items] = paragraph.split("\n- ");
              return (
                <div key={i}>
                  {intro && <p className="text-gray-700 leading-relaxed">{intro}</p>}
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                    {items.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                </div>
              );
            }

            // Check for numbered lists
            if (/^\d+\./.test(paragraph)) {
              return (
                <ol key={i} className="list-decimal list-inside space-y-1 text-gray-700 ml-2">
                  {paragraph.split("\n").filter(Boolean).map((item, j) => (
                    <li key={j}>{item.replace(/^\d+\.\s*/, "")}</li>
                  ))}
                </ol>
              );
            }
            
            // Regular paragraph
            return (
              <p key={i} className="text-gray-700 leading-relaxed mb-4">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Concept explanation box */}
        {step.conceptExplanation && (
          <div className="mt-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-amber-500 shrink-0" />
              <div>
                <h4 className="font-bold text-amber-900 mb-1">💡 Good to Know</h4>
                <p className="text-amber-800 text-sm">{step.conceptExplanation}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Code Editor (if this step has code) */}
      {step.codeTemplate && (
        <div className="space-y-4">
          <PythonEditor
            initialCode={step.codeTemplate}
            expectedOutput={step.expectedOutput}
            hint={step.hint}
            onCodeChange={handleCodeChange}
            onSuccess={handleCodeSuccess}
            height="220px"
          />
        </div>
      )}

      {/* Game Preview (if enabled for this step) */}
      {step.showGamePreview && (
        <div className="mt-4">
          <GameCanvas code={code} height="300px" />
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        {onPrevious ? (
          <button
            onClick={onPrevious}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>
        ) : (
          <div />
        )}

        {onNext && (
          <button
            onClick={onNext}
            disabled={!canProceed && !canGoNext}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              canProceed || canGoNext
                ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:scale-105 shadow-lg"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {stepNumber === totalSteps ? "Complete Mission" : "Next Step"}
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Completion hint */}
      {needsCodeValidation && !stepCompleted && !isCompleted && (
        <p className="text-center text-sm text-gray-500">
          ✨ Run the code correctly to unlock the next step
        </p>
      )}
    </div>
  );
}

