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
import Image from "next/image";
import Link from "next/link";
import { MissionStep } from "@/lib/missions/schema";
import { ValidationResult, CheckResult } from "@/lib/validation";

interface StepPanelProps {
  step: MissionStep;
  stepNumber: number;
  totalSteps: number;
  missionTitle: string;
  validationResult?: ValidationResult;
  isCompleted: boolean;
  onCompleteStep?: () => void;
  onPrevStep?: () => void;
  onNextStep?: () => void;
  hasPrevStep: boolean;
  hasNextStep: boolean;
  nextMissionId?: string;
  allStepsComplete?: boolean;
}

// =============================================================================
// INLINE TEXT RENDERERS
// =============================================================================

/** Renders inline `code` spans — dark style for legacy panel */
function InlineLine({ text }: { text: string }) {
  const parts = text.split(/`([^`]+)`/);
  return (
    <span>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <code key={i} className="bg-slate-800 text-emerald-300 font-mono text-xs px-1.5 py-0.5 rounded mx-0.5">
            {part}
          </code>
        ) : part
      )}
    </span>
  );
}

/** Renders inline `code` spans — light style for Codog speech bubble */
function SlideInline({ text }: { text: string }) {
  const parts = text.split(/`([^`]+)`/);
  return (
    <span>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <code key={i} className="bg-indigo-100 text-indigo-800 font-mono text-xs px-1.5 py-0.5 rounded mx-0.5">
            {part}
          </code>
        ) : part
      )}
    </span>
  );
}

/** Renders instruction text with fenced code blocks and inline code. */
function FormattedText({ text, className }: { text: string; className?: string }) {
  const segments: Array<{ type: 'text' | 'code'; content: string }> = [];
  const fenceRe = /```(?:\w+)?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;

  while ((m = fenceRe.exec(text)) !== null) {
    if (m.index > lastIndex) segments.push({ type: 'text', content: text.slice(lastIndex, m.index) });
    segments.push({ type: 'code', content: m[1].replace(/\n$/, '') });
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length) segments.push({ type: 'text', content: text.slice(lastIndex) });

  return (
    <span className={className}>
      {segments.map((seg, si) => {
        if (seg.type === 'code') {
          return (
            <pre key={si} className="bg-slate-900 text-emerald-300 text-xs font-mono rounded-xl px-4 py-3 my-2 overflow-x-auto whitespace-pre leading-relaxed">
              {seg.content}
            </pre>
          );
        }
        const paragraphs = seg.content.split(/\n\n+/).filter(p => p.trim());
        return (
          <span key={si}>
            {paragraphs.map((para, pi) => {
              const lines = para.split('\n');
              return (
                <p key={pi} className="mb-2 last:mb-0 leading-relaxed">
                  {lines.map((line, li) => (
                    <span key={li}>
                      {li > 0 && <br />}
                      <InlineLine text={line} />
                    </span>
                  ))}
                </p>
              );
            })}
          </span>
        );
      })}
    </span>
  );
}

// =============================================================================
// STEP NAV BUTTON — shared between both panel variants
// =============================================================================

function StepNavFooter({
  onPrevStep,
  onNextStep,
  hasPrevStep,
  hasNextStep,
  isCompleted,
  nextMissionId,
  allStepsComplete,
  dark = false,
}: {
  onPrevStep?: () => void;
  onNextStep?: () => void;
  hasPrevStep: boolean;
  hasNextStep: boolean;
  isCompleted: boolean;
  nextMissionId?: string;
  allStepsComplete?: boolean;
  dark?: boolean;
}) {
  const borderCls = dark ? "border-white/10" : "border-gray-200";
  const bgCls = dark ? "bg-black/30" : "bg-gray-50";
  const prevEnabledCls = dark ? "text-white/70 hover:bg-white/10" : "text-gray-600 hover:bg-gray-200";
  const prevDisabledCls = dark ? "text-white/20 cursor-not-allowed" : "text-gray-300 cursor-not-allowed";

  return (
    <div className={`border-t ${borderCls} ${bgCls} px-4 py-3 flex items-center justify-between`}>
      <button
        onClick={onPrevStep}
        disabled={!hasPrevStep}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition-all ${hasPrevStep ? prevEnabledCls : prevDisabledCls}`}
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      {(allStepsComplete || (!hasNextStep && isCompleted)) ? (
        nextMissionId ? (
          <Link href={`/play/${nextMissionId}`} className="flex items-center gap-1 px-4 py-2 rounded-lg font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition-all">
            Next Mission <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link href="/dashboard" className="flex items-center gap-1 px-4 py-2 rounded-lg font-bold bg-violet-600 text-white hover:bg-violet-700 transition-all">
            Back to Map <ChevronRight className="w-4 h-4" />
          </Link>
        )
      ) : (
        <button
          onClick={onNextStep}
          disabled={!hasNextStep || !isCompleted}
          className={`flex items-center gap-1 px-4 py-2 rounded-lg font-bold transition-all ${
            hasNextStep && isCompleted
              ? "bg-violet-600 text-white hover:bg-violet-700"
              : dark
                ? "bg-white/10 text-white/30 cursor-not-allowed"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next Step <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// =============================================================================
// CODOG PANEL — full right-panel Codog experience
// =============================================================================

const CODOG_IMAGES = [
  '/codog_1.png',
  '/codog_2.png',
  '/codog_3.png',
  '/codog_4.png',
  '/codog_5.png',
];

function randomCodog(): string {
  return CODOG_IMAGES[Math.floor(Math.random() * CODOG_IMAGES.length)];
}

type CodogMode = 'slides' | 'hint' | 'solution_confirm' | 'solution';

function CodogPanel(props: StepPanelProps) {
  const { step, stepNumber, totalSteps, missionTitle, isCompleted } = props;
  const slides = step.instructionSlides!;

  const [slideIndex, setSlideIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [mode, setMode] = useState<CodogMode>('slides');
  const [codogImg, setCodogImg] = useState(randomCodog);

  const goNext = () => {
    if (slideIndex < slides.length - 1) { setDirection(1); setSlideIndex(i => i + 1); setCodogImg(randomCodog()); }
  };
  const goPrev = () => {
    if (slideIndex > 0) { setDirection(-1); setSlideIndex(i => i - 1); setCodogImg(randomCodog()); }
  };
  const goTo = (i: number) => {
    setDirection(i > slideIndex ? 1 : -1);
    setSlideIndex(i);
    setCodogImg(randomCodog());
  };

  const bubbleContent = () => {
    if (mode === 'hint' && step.hint) {
      return (
        <div className="w-full">
          <p className="text-xs font-bold text-amber-600 mb-1.5">Codog&apos;s Hint:</p>
          <p className="text-amber-800 text-sm leading-relaxed">
            <SlideInline text={`💡 ${step.hint}`} />
          </p>
        </div>
      );
    }
    if (mode === 'solution_confirm') {
      return (
        <div className="w-full">
          <p className="font-bold text-gray-800 text-sm mb-1">Are you sure?</p>
          <p className="text-gray-500 text-xs leading-relaxed">Try the hint first! If you&apos;re really stuck, I&apos;ll show you the answer.</p>
        </div>
      );
    }
    if (mode === 'solution' && step.solutionCode) {
      return (
        <div className="w-full">
          <p className="text-xs font-bold text-gray-500 mb-2">Solution:</p>
          <pre className="bg-slate-900 text-emerald-400 text-xs font-mono overflow-x-auto whitespace-pre rounded-xl p-3 leading-relaxed max-h-[180px] overflow-y-auto">
            {step.solutionCode}
          </pre>
        </div>
      );
    }
    // slides mode
    return (
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={slideIndex}
          custom={direction}
          variants={{
            enter: (dir: number) => ({ x: dir * 28, opacity: 0 }),
            center: { x: 0, opacity: 1 },
            exit: (dir: number) => ({ x: dir * -28, opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.18 }}
          className="text-gray-800 text-sm leading-relaxed w-full"
        >
          <SlideInline text={slides[slideIndex]} />
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="flex flex-col bg-gradient-to-b from-indigo-950 via-violet-900 to-indigo-900 rounded-2xl overflow-hidden shadow-2xl">

      {/* Header */}
      <div className="px-4 py-3 bg-black/30 shrink-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-indigo-300 text-xs font-medium truncate pr-2">{missionTitle}</p>
          {isCompleted && (
            <span className="flex items-center gap-1 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-medium shrink-0">
              <CheckCircle className="w-3 h-3" /> Done!
            </span>
          )}
        </div>
        <h2 className="text-white font-bold text-sm">Step {stepNumber} of {totalSteps}</h2>
        <div className="flex gap-1 mt-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${
              i + 1 < stepNumber ? "bg-emerald-400" : i + 1 === stepNumber ? "bg-white" : "bg-white/20"
            }`} />
          ))}
        </div>
      </div>

      {/* Concept tags */}
      <div className="px-4 pt-3 flex flex-wrap gap-1.5 shrink-0">
        {step.concepts.map(c => (
          <span key={c} className="px-2 py-0.5 bg-white/10 text-indigo-200 text-xs rounded-full font-medium">{c}</span>
        ))}
      </div>

      {/* Main area: speech bubble + controls + Codog */}
      <div className="flex flex-col items-center px-4 pb-2 pt-4">

        {/* Speech bubble */}
        <div className="w-full mb-1">
          <div className="bg-white rounded-2xl p-4 shadow-xl min-h-[110px] flex items-start">
            {bubbleContent()}
          </div>
          {/* Bubble tail pointing down toward Codog */}
          <div className="flex justify-center">
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[14px] border-t-white" />
          </div>
        </div>

        {/* Controls row — slides mode shows nav + hint/solution; other modes show back */}
        {mode === 'slides' ? (
          <div className="w-full mb-3 flex flex-col gap-2">
            {/* Slide nav */}
            <div className="flex items-center gap-2">
              <button
                onClick={goPrev}
                disabled={slideIndex === 0}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                  slideIndex === 0 ? "text-white/25 cursor-not-allowed" : "text-white hover:bg-white/10"
                }`}
              >
                Back
              </button>
              <div className="flex-1 flex justify-center gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      i === slideIndex ? "bg-white w-4" : "bg-white/30 hover:bg-white/60 w-2"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={goNext}
                disabled={slideIndex === slides.length - 1}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                  slideIndex === slides.length - 1
                    ? "text-white/25 cursor-not-allowed"
                    : "bg-white text-indigo-700 hover:bg-indigo-50"
                }`}
              >
                Next
              </button>
            </div>

            {/* Hint + Solution action buttons */}
            {(step.hint || step.solutionCode) && (
              <div className="flex gap-2 justify-center">
                {step.hint && (
                  <button
                    onClick={() => setMode('hint')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-400/20 border border-amber-400/40 text-amber-200 hover:bg-amber-400/30 transition-all"
                  >
                    <Lightbulb className="w-3.5 h-3.5" /> Hint
                  </button>
                )}
                {step.solutionCode && (
                  <button
                    onClick={() => setMode('solution_confirm')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 border border-white/20 text-white/60 hover:bg-white/20 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" /> Solution
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-2 mb-3 w-full justify-center">
            {mode === 'solution_confirm' && (
              <button
                onClick={() => setMode('solution')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-500/80 border border-rose-400/50 text-white hover:bg-rose-500 transition-all"
              >
                <Eye className="w-3.5 h-3.5" /> Yes, show me
              </button>
            )}
            <button
              onClick={() => setMode('slides')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Back to guide
            </button>
          </div>
        )}

        {/* Codog character */}
        <Image
          src={codogImg}
          alt="Codog"
          width={150}
          height={150}
          className="drop-shadow-2xl shrink-0"
        />
      </div>

      {/* Step navigation */}
      <StepNavFooter {...props} dark />
    </div>
  );
}

// =============================================================================
// LEGACY PANEL — shown for packs without instructionSlides
// =============================================================================

function LegacyPanel(props: StepPanelProps) {
  const { step, stepNumber, totalSteps, missionTitle, validationResult, isCompleted } = props;

  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [confirmSolution, setConfirmSolution] = useState(false);

  const handleShowSolution = () => {
    if (showSolution) { setShowSolution(false); setConfirmSolution(false); }
    else if (!confirmSolution) { setConfirmSolution(true); }
    else { setShowSolution(true); setConfirmSolution(false); }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-violet-200 text-xs font-medium">{missionTitle}</p>
            <h2 className="text-white font-bold">Step {stepNumber} of {totalSteps}</h2>
          </div>
          {isCompleted && (
            <div className="flex items-center gap-1 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              <CheckCircle className="w-4 h-4" /> Complete!
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 mt-3">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${
              i + 1 < stepNumber ? "bg-emerald-400" : i + 1 === stepNumber ? "bg-white" : "bg-white/30"
            }`} />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {step.concepts.map(c => (
            <span key={c} className="px-2 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">{c}</span>
          ))}
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200">
          <h3 className="font-bold text-amber-900 mb-2">🎯 Your Goal</h3>
          <div className="text-amber-800 text-sm"><FormattedText text={step.instruction} /></div>
        </div>

        {step.detailedExplanation && (
          <div className="space-y-2">
            {step.detailedExplanation.split(/\n\n+/).filter(p => p.trim()).map((bubble, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15, duration: 0.3 }}
                className="bg-blue-50 rounded-2xl rounded-tl-sm px-4 py-3 border border-blue-200 text-sm text-blue-800">
                <FormattedText text={bubble} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Success criteria */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-medium text-gray-700 mb-3">What you need to do:</h4>
          <ul className="space-y-2">
            {step.successCriteria.map((criterion, i) => {
              const allPassed = isCompleted || validationResult?.passed === true;
              return (
                <li key={i} className="flex items-start gap-2 text-sm">
                  {allPassed
                    ? <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    : <Circle className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />}
                  <span className={allPassed ? "text-emerald-700 font-medium" : "text-gray-600"}>{criterion}</span>
                </li>
              );
            })}
          </ul>
          {isCompleted && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl">
              <CheckCircle className="w-4 h-4" /> Step Complete! 🎉
            </motion.div>
          )}
        </div>

        {/* Validation results */}
        {validationResult && (
          <AnimatePresence>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className={`rounded-xl p-4 border-2 ${validationResult.passed ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}>
              <h4 className={`font-bold mb-2 ${validationResult.passed ? "text-emerald-700" : "text-rose-700"}`}>
                {validationResult.passed ? "🎉 Success!" : "🔍 Check your code:"}
              </h4>
              <ul className="space-y-1">
                {validationResult.checks.map((check, i) => <CheckResultItem key={i} result={check} />)}
              </ul>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Hint */}
        {step.hint && (
          <div className="border border-amber-200 rounded-xl overflow-hidden">
            <button onClick={() => setShowHint(!showHint)}
              className="w-full flex items-center justify-between p-3 bg-amber-50 hover:bg-amber-100 transition-colors">
              <span className="flex items-center gap-2 font-medium text-amber-700">
                <Lightbulb className="w-4 h-4" /> Need a hint?
              </span>
              {showHint ? <EyeOff className="w-4 h-4 text-amber-500" /> : <Eye className="w-4 h-4 text-amber-500" />}
            </button>
            <AnimatePresence>
              {showHint && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="p-3 bg-amber-50/50 text-amber-800 text-sm border-t border-amber-200">
                    <FormattedText text={`💡 ${step.hint}`} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Solution */}
        {step.solutionCode && (
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button onClick={handleShowSolution}
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
              <span className="flex items-center gap-2 font-medium text-gray-600">
                {showSolution ? "Hide Solution" : "Show Solution"}
              </span>
              {showSolution ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
            </button>
            <AnimatePresence>
              {confirmSolution && !showSolution && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="p-3 bg-rose-50 text-rose-800 text-sm border-t border-gray-200">
                    <p className="mb-2">Are you sure? Try the hint first!</p>
                    <button onClick={handleShowSolution} className="text-rose-600 underline text-xs">Yes, show me the solution</button>
                  </div>
                </motion.div>
              )}
              {showSolution && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <pre className="p-3 bg-slate-900 text-emerald-400 text-xs font-mono overflow-x-auto border-t border-gray-200 whitespace-pre">{step.solutionCode}</pre>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Reward */}
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-200">
          <h4 className="font-medium text-yellow-800 mb-2">🏆 Rewards:</h4>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: step.reward.stars }, (_, i) => (
                <Star key={i} className={`w-5 h-5 ${isCompleted ? "text-yellow-400 fill-yellow-400" : "text-yellow-300"}`} />
              ))}
            </div>
            {step.reward.badge && (
              <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${isCompleted ? "bg-violet-100 text-violet-700" : "bg-gray-100 text-gray-500"}`}>
                <Trophy className="w-3 h-3" /> {step.reward.badge}
              </span>
            )}
          </div>
        </div>

        {/* Customization */}
        {step.customization && (
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
            <h4 className="font-medium text-purple-800 mb-2">🎨 Make it yours!</h4>
            <p className="text-purple-700 text-sm mb-3">{step.customization.description}</p>
            {step.customization.options && (
              <div className="flex flex-wrap gap-2">
                {step.customization.options.map(option => (
                  <span key={option} className="px-2 py-1 bg-white border border-purple-200 text-purple-700 rounded-lg text-xs font-mono">{option}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <StepNavFooter {...props} />
    </div>
  );
}

// =============================================================================
// PUBLIC EXPORT — dispatches to Codog or Legacy based on step content
// =============================================================================

export function StepPanel(props: StepPanelProps) {
  if (props.step.instructionSlides?.length) {
    return <CodogPanel {...props} />;
  }
  return <LegacyPanel {...props} />;
}

function CheckResultItem({ result }: { result: CheckResult }) {
  return (
    <li className="flex items-start gap-2 text-sm">
      {result.passed
        ? <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
        : <Circle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />}
      <span className={result.passed ? "text-emerald-700" : "text-rose-700"}>{result.message}</span>
    </li>
  );
}
