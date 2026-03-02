"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

const TOUR_KEY = "snake-tour-v1-seen";
// The tour auto-opens on the first snake mission regardless of which step the user is on
const TOUR_MISSION_ID = "sn1_hello_python";

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

const TOUR_STEPS: TourStep[] = [
  {
    emoji: "🐍",
    title: "Welcome to DreamPaths!",
    description:
      "I'm Slimy the snake! You're going to learn Python by writing code that controls ME. Let me quickly show you around so you know where everything is!",
  },
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
    title: "The Snake Game",
    description:
      "Your code makes ME move! When you click Run Code, watch what happens here. You can also steer me with your arrow keys once the game is running. Can you find the red food?",
  },
  {
    emoji: "🚀",
    title: "You're all set!",
    description:
      "That's everything! Start by reading the mission instructions, write your code in the editor, and hit Run Code. Don't forget — you can always use the hints if you get stuck. Have fun! 🎉",
  },
];

const SPRING = { type: "spring" as const, stiffness: 320, damping: 28 };

interface SnakeTourProps {
  missionId: string;
}

export function SnakeTour({ missionId }: SnakeTourProps) {
  const [tourStep, setTourStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  // While true the card is hidden — we're scrolling/measuring before revealing it
  const [isMeasuring, setIsMeasuring] = useState(false);

  // Show the tour the first time the user visits the first snake mission.
  // Runs once on mount — the parent only renders this component for snake missions.
  useEffect(() => {
    if (missionId !== TOUR_MISSION_ID) return;
    try {
      if (!localStorage.getItem(TOUR_KEY)) setVisible(true);
    } catch { /* localStorage unavailable — skip tour silently */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Measure the target element whenever the tour step changes
  useEffect(() => {
    if (!visible) return;

    const step = TOUR_STEPS[tourStep];

    // Clear rect. For steps that need to scroll+measure, also hide the card
    // so it doesn't briefly flash in the center before snapping to its final position.
    setTargetRect(null);

    if (!step.target) {
      setIsMeasuring(false);
      return;
    }

    setIsMeasuring(true); // hide card until we've scrolled and measured

    const run = async () => {
      const el = document.querySelector(`[data-tour="${step.target}"]`);
      if (!el) { setIsMeasuring(false); return; }

      if (step.scrollIntoView) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        // Wait for the smooth scroll to settle before measuring
        await new Promise<void>(r => setTimeout(r, 650));
      }

      setTargetRect(el.getBoundingClientRect());
      setIsMeasuring(false); // reveal card in its correct position
    };

    const t = setTimeout(run, 80);
    return () => clearTimeout(t);
  }, [tourStep, visible]);

  const handleNext = () =>
    tourStep < TOUR_STEPS.length - 1 ? setTourStep(s => s + 1) : finish();

  const handlePrev = () =>
    tourStep > 0 && setTourStep(s => s - 1);

  const finish = () => {
    try { localStorage.setItem(TOUR_KEY, "1"); } catch { /* ignore */ }
    setVisible(false);
  };

  if (!visible) return null;

  const step = TOUR_STEPS[tourStep];
  const isLast = tourStep === TOUR_STEPS.length - 1;

  // Only show spotlight when the CURRENT tour step declares a target AND we've measured it.
  // This prevents a stale rect from a previous step bleeding into a targetless step.
  const showSpotlight = !!step.target && !!targetRect && !isMeasuring;

  // ── Card inner content (shared between centered and positioned variants) ──────
  const cardContent = (
    <>
      <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 px-5 pt-5 pb-4">
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
          {TOUR_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === tourStep ? "w-6 bg-emerald-500" : i < tourStep ? "w-2 bg-emerald-300" : "w-2 bg-gray-200"
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
            className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 active:scale-95 transition-all text-sm shadow-sm"
          >
            {isLast ? "Let's go! 🚀" : "Next"}
            {!isLast && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </>
  );

  // ── Spotlight tooltip position ────────────────────────────────────────────────
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
      {/* ── Dark overlay ───────────────────────────────────────────────────── */}
      {showSpotlight && targetRect ? (
        <>
          {/* Click-blocker (transparent, covers viewport) */}
          <div style={{ position: "fixed", inset: 0, zIndex: 9000 }} onClick={e => e.stopPropagation()} />
          {/* Spotlight ring — giant box-shadow darkens everything outside it */}
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

      {/* ── Card (hidden while scrolling/measuring to avoid flash-of-center) ── */}
      {!isMeasuring && showSpotlight ? (
        /*
         * SPOTLIGHT MODE — card sits beside the highlighted element.
         * Position is set via left/right/top; no CSS transform needed.
         */
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
        /*
         * CENTERED MODE — a flexbox wrapper centers the card on any screen.
         * The motion.div animates with `y` freely; no CSS transform conflict.
         */
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
