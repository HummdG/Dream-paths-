"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

// First mission ID of each free starter pack
const FREE_PACK_FIRST_MISSIONS = [
  "sn1_hello_python",
  "rc1_mission_briefing",
  "pm1_first_day",
] as const;

type FreeMissionId = typeof FREE_PACK_FIRST_MISSIONS[number];

function tourKey(childId: string) {
  return `pack-tour-v1-seen-${childId}`;
}

const PADDING = 10;    // px of breathing room around each spotlight target
const TOOLTIP_W = 340; // card width in px
const GAP = 20;        // gap between spotlight edge and card

interface TourStep {
  target?: string;       // data-tour attribute; absent = centered fullscreen card
  scrollIntoView?: boolean;
  emoji: string;
  title: string;
  description: string;
}

const INTRO_BY_MISSION: Record<FreeMissionId, { emoji: string; title: string; description: string }> = {
  sn1_hello_python: {
    emoji: "🐍",
    title: "Welcome to DreamPaths!",
    description:
      "I'm Slimy the snake! You're going to learn Python by writing code that controls ME. Let me quickly show you around so you know where everything is!",
  },
  rc1_mission_briefing: {
    emoji: "🚀",
    title: "Welcome to DreamPaths!",
    description:
      "Strap in, Space Cadet! You're going to learn Python by writing code that launches and steers a real rocket. Let me quickly show you around so you know where everything is!",
  },
  pm1_first_day: {
    emoji: "🩺",
    title: "Welcome to DreamPaths!",
    description:
      "Welcome to the Junior Medic Academy! You're going to learn Python by writing code that monitors patients and keeps them healthy. Let me quickly show you around!",
  },
};

const SHARED_STEPS: TourStep[] = [
  {
    target: "step-panel",
    emoji: "📋",
    title: "Mission Instructions",
    description:
      "This panel tells you exactly what to do for each step! Read your goal, peek at the hints if you get stuck, and see when you've completed the step. Always start here!",
  },
  {
    target: "code-editor",
    emoji: "✏️",
    title: "Code Editor",
    description:
      "This is where you type your Python code! When you're ready to test it, click the green Run Code button. Don't worry about making mistakes — that's how coding works!",
  },
  {
    target: "game-preview",
    scrollIntoView: true,
    emoji: "🎮",
    title: "Your Game",
    description:
      "Your code comes to life here! When you click Run Code, watch what happens. Don't forget — you can always use the hints if you get stuck.",
  },
  {
    emoji: "🌟",
    title: "You're all set!",
    description:
      "That's everything! Start by reading the mission instructions, write your code in the editor, and hit Run Code. Have fun!",
  },
];

const SPRING = { type: "spring" as const, stiffness: 320, damping: 28 };

interface PackTourProps {
  missionId: string;
  childId: string;
}

export function PackTour({ missionId, childId }: PackTourProps) {
  const [tourStep, setTourStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isMeasuring, setIsMeasuring] = useState(false);

  const isTourMission = (FREE_PACK_FIRST_MISSIONS as readonly string[]).includes(missionId);
  const intro = isTourMission ? INTRO_BY_MISSION[missionId as FreeMissionId] : null;
  const tourSteps: TourStep[] = intro
    ? [{ emoji: intro.emoji, title: intro.title, description: intro.description }, ...SHARED_STEPS]
    : [];

  useEffect(() => {
    if (!isTourMission) return;
    try {
      if (!localStorage.getItem(tourKey(childId))) setVisible(true);
    } catch { /* localStorage unavailable */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!visible || tourSteps.length === 0) return;

    const step = tourSteps[tourStep];
    setTargetRect(null);

    if (!step.target) {
      setIsMeasuring(false);
      return;
    }

    setIsMeasuring(true);

    const run = async () => {
      const el = document.querySelector(`[data-tour="${step.target}"]`);
      if (!el) { setIsMeasuring(false); return; }

      if (step.scrollIntoView) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        await new Promise<void>(r => setTimeout(r, 650));
      }

      setTargetRect(el.getBoundingClientRect());
      setIsMeasuring(false);
    };

    const t = setTimeout(run, 80);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourStep, visible]);

  const handleNext = () =>
    tourStep < tourSteps.length - 1 ? setTourStep(s => s + 1) : finish();

  const handlePrev = () =>
    tourStep > 0 && setTourStep(s => s - 1);

  const finish = () => {
    try { localStorage.setItem(tourKey(childId), "1"); } catch { /* ignore */ }
    setVisible(false);
  };

  if (!visible || tourSteps.length === 0) return null;

  const step = tourSteps[tourStep];
  const isLast = tourStep === tourSteps.length - 1;
  const showSpotlight = !!step.target && !!targetRect && !isMeasuring;

  const cardContent = (
    <>
      <div className="relative bg-gradient-to-r from-violet-500 to-indigo-500 px-5 pt-5 pb-4">
        <button
          onClick={finish}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 text-white/80 hover:bg-white/40 hover:text-white flex items-center justify-center transition-all"
          aria-label="Skip tour"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-5xl mb-2 select-none" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))" }}>
          {step.emoji}
        </div>

        <h3 className="text-white font-extrabold text-xl leading-tight">{step.title}</h3>
      </div>

      <div className="px-5 py-4">
        <p className="text-gray-700 leading-relaxed text-sm mb-5">{step.description}</p>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5 mb-4">
          {tourSteps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === tourStep ? "w-6 bg-violet-500" : i < tourStep ? "w-2 bg-violet-300" : "w-2 bg-gray-200"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          {tourStep > 0 ? (
            <button
              onClick={handlePrev}
              className="flex items-center gap-1 px-3 py-2 text-gray-500 hover:text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <button onClick={finish} className="text-sm text-gray-400 hover:text-gray-600 transition-colors px-2 py-2">
              Skip tour
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-violet-500 text-white rounded-xl font-bold hover:bg-violet-600 active:scale-95 transition-all text-sm shadow-sm"
          >
            {isLast ? "Let's go!" : "Next"}
            {!isLast && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </>
  );

  let spotlightStyle: React.CSSProperties = {};
  if (showSpotlight && targetRect) {
    const centerX = targetRect.left + targetRect.width / 2;
    const isRightHalf = centerX > window.innerWidth / 2;
    const idealTop = targetRect.top + targetRect.height / 2 - 150;
    const clampedTop = Math.max(16, Math.min(idealTop, window.innerHeight - 340));

    spotlightStyle = isRightHalf
      ? { position: "fixed", right: window.innerWidth - targetRect.left + GAP, top: clampedTop, width: TOOLTIP_W, zIndex: 9002 }
      : { position: "fixed", left: targetRect.right + GAP, top: clampedTop, width: TOOLTIP_W, zIndex: 9002 };
  }

  return (
    <>
      {showSpotlight && targetRect ? (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 9000 }} onClick={e => e.stopPropagation()} />
          <div
            style={{
              position: "fixed",
              top: targetRect.top - PADDING,
              left: targetRect.left - PADDING,
              width: targetRect.width + PADDING * 2,
              height: targetRect.height + PADDING * 2,
              borderRadius: 14,
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.78)",
              border: "3px solid #fbbf24",
              zIndex: 9001,
              pointerEvents: "none",
            }}
          />
        </>
      ) : (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)", zIndex: 9001 }}
          onClick={e => e.stopPropagation()}
        />
      )}

      {!isMeasuring && showSpotlight ? (
        <motion.div
          key={`card-spot-${tourStep}`}
          initial={{ opacity: 0, scale: 0.9, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={SPRING}
          style={spotlightStyle}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {cardContent}
        </motion.div>
      ) : !isMeasuring ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9002,
            pointerEvents: "none",
          }}
        >
          <motion.div
            key={`card-center-${tourStep}`}
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={SPRING}
            style={{ width: TOOLTIP_W, pointerEvents: "all" }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {cardContent}
          </motion.div>
        </div>
      ) : null}
    </>
  );
}
