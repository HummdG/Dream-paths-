"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export type TransitionPathId = "computer_scientist" | "astronaut" | "doctor";

// ── Static data (no animated per-element transforms — only opacity + translate) ──

// Binary grid: 13 rows × 22 cols, deterministic
const BINARY_GRID = Array.from({ length: 13 * 22 }, (_, i) =>
  (i * 13 + i % 7) % 3 === 0 ? "1" : "0"
);

// Hyperspace streaks: 18 lines spread across the screen height, each animates scaleX only
const STREAKS = Array.from({ length: 18 }, (_, i) => ({
  top: 3 + (i / 18) * 94,
  delay: i * 0.016,
  duration: 0.38 + (i % 4) * 0.06,
  color:
    i % 5 === 0 ? "#38bdf8"
    : i % 4 === 0 ? "#c084fc"
    : i % 3 === 0 ? "#818cf8"
    : "#ffffff",
  thickness: i % 4 === 0 ? 2 : 1,
  peakOpacity: 0.45 + (i % 3) * 0.2,
}));

// ── Computer Scientist — Matrix Sweep ────────────────────────────────────────
// Static 0/1 grid + 2 moving light beams. Only 3 animated elements.

function DigitalSweepEffect() {
  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        background: "#000",
        overflow: "hidden",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.07 }}
    >
      {/* Static binary grid — zero animations */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          gridTemplateColumns: "repeat(22, 1fr)",
          gridTemplateRows: "repeat(13, 1fr)",
          alignItems: "center",
          justifyItems: "center",
          color: "#00ff41",
          fontFamily: "monospace",
          fontSize: 18,
          opacity: 0.35,
          userSelect: "none",
        }}
      >
        {BINARY_GRID.map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </div>

      {/* Sweep beam 1 — main */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: "28%",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0,255,65,0.15) 25%, rgba(0,255,65,0.85) 50%, rgba(0,255,65,0.15) 75%, transparent 100%)",
          filter: "blur(3px)",
        }}
        initial={{ left: "-28%" }}
        animate={{ left: "115%" }}
        transition={{ duration: 0.85, delay: 0.15, ease: "easeInOut" }}
      />

      {/* Sweep beam 2 — faster follow-up */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: "18%",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0,255,65,0.08) 25%, rgba(0,255,65,0.5) 50%, rgba(0,255,65,0.08) 75%, transparent 100%)",
        }}
        initial={{ left: "-18%" }}
        animate={{ left: "115%" }}
        transition={{ duration: 0.55, delay: 0.72, ease: "easeInOut" }}
      />

      {/* Final white flash */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background: "white",
          zIndex: 10,
          pointerEvents: "none",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0, 1] }}
        transition={{ duration: 1.5, times: [0, 0.68, 0.84, 1] }}
      />
    </motion.div>
  );
}

// ── Astronaut — Hyperspace Jump ───────────────────────────────────────────────
// 18 streaks animating scaleX only (GPU composited) + 1 central flash.

function HyperspaceEffect() {
  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background:
          "radial-gradient(ellipse at center, #050d1f 0%, #000510 55%, #000000 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.07 }}
    >
      {/* Hyperspace streaks — scaleX only, transform-origin center */}
      {STREAKS.map((streak, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            top: `${streak.top}%`,
            left: 0,
            right: 0,
            height: streak.thickness,
            background: `linear-gradient(90deg, transparent 0%, ${streak.color} 30%, ${streak.color} 70%, transparent 100%)`,
            transformOrigin: "center center",
            boxShadow:
              streak.thickness > 1
                ? `0 0 6px ${streak.color}`
                : undefined,
          }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: [0, 1],
            opacity: [0, streak.peakOpacity, streak.peakOpacity, 0],
          }}
          transition={{
            duration: streak.duration,
            delay: streak.delay,
            ease: "easeOut",
            times: [0, 0.3, 0.7, 1],
          }}
        />
      ))}

      {/* Central starburst flash */}
      <motion.div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, #ffffff 0%, #38bdf8 35%, transparent 70%)",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
        initial={{ width: 0, height: 0, opacity: 0 }}
        animate={{
          width: ["0px", "60px", "180vmax"],
          height: ["0px", "60px", "180vmax"],
          opacity: [0, 1, 0],
        }}
        transition={{ duration: 1.4, delay: 0.25, ease: [0.3, 0, 0.2, 1] }}
      />

      {/* Final white flash */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background: "white",
          zIndex: 10,
          pointerEvents: "none",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0, 1] }}
        transition={{ duration: 1.5, times: [0, 0.68, 0.84, 1] }}
      />
    </motion.div>
  );
}

// ── Doctor — Medical Scanner (unchanged) ─────────────────────────────────────

function MedicalScanEffect() {
  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "#f0fffe",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
    >
      {/* Teal grid */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.18) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.18) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.5, times: [0, 0.12, 0.8, 1] }}
      />

      {/* Scanner beam — first pass */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: "45%",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.12) 25%, rgba(6,182,212,0.75) 50%, rgba(6,182,212,0.12) 75%, transparent 100%)",
          filter: "blur(3px)",
          zIndex: 3,
        }}
        initial={{ left: "-45%" }}
        animate={{ left: "110%" }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
      />

      {/* Scanner beam — second pass */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: "30%",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.06) 25%, rgba(6,182,212,0.45) 50%, rgba(6,182,212,0.06) 75%, transparent 100%)",
          zIndex: 3,
        }}
        initial={{ left: "-30%" }}
        animate={{ left: "110%" }}
        transition={{ duration: 0.55, delay: 0.72, ease: "easeInOut" }}
      />

      {/* ECG heartbeat line */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 4,
        }}
      >
        <motion.svg
          width="84%"
          height="140"
          viewBox="0 0 900 140"
          fill="none"
          style={{ filter: "drop-shadow(0 0 10px #06b6d4)" }}
        >
          <motion.path
            d="M0,70 L190,70 L212,70 L230,14 L248,126 L266,14 L284,70 L308,70 L326,40 L346,100 L366,70 L710,70 L900,70"
            stroke="#06b6d4"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 1.1,
              delay: 0.12,
              ease: "easeInOut",
              times: [0, 0.08, 0.82, 1],
            }}
          />
        </motion.svg>
      </div>

      {/* Medical cross growing from center */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 5,
        }}
      >
        <motion.svg
          viewBox="0 0 80 80"
          fill="#06b6d4"
          style={{ filter: "drop-shadow(0 0 20px rgba(6,182,212,0.7))" }}
          initial={{ width: 0, height: 0, opacity: 0 }}
          animate={{
            width: ["0px", "72px", "72px", "600px"],
            height: ["0px", "72px", "72px", "600px"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 1.5,
            times: [0, 0.22, 0.62, 1],
            ease: "easeInOut",
          }}
        >
          <rect x="30" y="5" width="20" height="70" rx="5" />
          <rect x="5" y="30" width="70" height="20" rx="5" />
        </motion.svg>
      </div>

      {/* Final white flash */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background: "white",
          zIndex: 10,
          pointerEvents: "none",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 0, 1] }}
        transition={{ duration: 1.5, times: [0, 0.68, 0.84, 1] }}
      />
    </motion.div>
  );
}

// ── Main overlay export ───────────────────────────────────────────────────────

interface PathTransitionOverlayProps {
  pathId: TransitionPathId;
  destination: string;
  onDone: () => void;
}

export function PathTransitionOverlay({
  pathId,
  destination,
  onDone,
}: PathTransitionOverlayProps) {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.push(destination);
      setTimeout(onDone, 500);
    }, 1450);
    return () => clearTimeout(t);
  }, [pathId, destination, router, onDone]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {pathId === "astronaut" && <HyperspaceEffect />}
      {pathId === "computer_scientist" && <DigitalSweepEffect />}
      {pathId === "doctor" && <MedicalScanEffect />}
    </div>
  );
}
