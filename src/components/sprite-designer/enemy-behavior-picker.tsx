"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";

export interface EnemyBehavior {
  type: "patrol" | "chase" | "jump" | "fly" | "stationary" | "zigzag" | "sine_wave" | "bounce" | "orbit" | "teleport";
  speed: number;
  range: number;
  jumpHeight?: number;
  orbitRadius?: number;
  teleportCooldown?: number;
}

interface EnemyBehaviorPickerProps {
  behavior: EnemyBehavior;
  onChange: (behavior: EnemyBehavior) => void;
}

const BEHAVIOR_OPTIONS = [
  {
    type: "patrol" as const,
    name: "Patrol",
    icon: "↔️",
    description: "Walk back and forth",
    preview: "Walks left and right within a range",
  },
  {
    type: "chase" as const,
    name: "Chase",
    icon: "🏃",
    description: "Follow the player",
    preview: "Moves toward the player when close",
  },
  {
    type: "jump" as const,
    name: "Jump",
    icon: "⬆️",
    description: "Hop around",
    preview: "Jumps up and down while moving",
  },
  {
    type: "fly" as const,
    name: "Fly",
    icon: "🦋",
    description: "Float in the air",
    preview: "Moves up and down in the air",
  },
  {
    type: "stationary" as const,
    name: "Still",
    icon: "🛑",
    description: "Stay in place",
    preview: "Doesn't move, but still dangerous!",
  },
  {
    type: "zigzag" as const,
    name: "Zigzag",
    icon: "⚡",
    description: "Move in zigzag pattern",
    preview: "Moves in a sharp zigzag diagonal pattern",
  },
  {
    type: "sine_wave" as const,
    name: "Wave",
    icon: "〰️",
    description: "Float up and down smoothly",
    preview: "Moves in a smooth wave pattern",
  },
  {
    type: "bounce" as const,
    name: "Bounce",
    icon: "🏀",
    description: "Bounce off walls",
    preview: "Bounces around like a ball",
  },
  {
    type: "orbit" as const,
    name: "Orbit",
    icon: "🔄",
    description: "Circle around a point",
    preview: "Moves in a circular orbit",
  },
  {
    type: "teleport" as const,
    name: "Teleport",
    icon: "✨",
    description: "Blink to random spots",
    preview: "Teleports to random positions",
  },
];

export function EnemyBehaviorPicker({
  behavior,
  onChange,
}: EnemyBehaviorPickerProps) {
  const [showInfo, setShowInfo] = useState<string | null>(null);

  const selectedBehavior = BEHAVIOR_OPTIONS.find((b) => b.type === behavior.type);

  return (
    <div className="space-y-4">
      {/* Behavior Type */}
      <div>
        <label className="text-sm text-white/70 block mb-2">Movement Pattern</label>
        <div className="grid grid-cols-5 gap-2 mb-2">
          {BEHAVIOR_OPTIONS.map((opt) => (
            <motion.button
              key={opt.type}
              onClick={() => onChange({ ...behavior, type: opt.type })}
              onMouseEnter={() => setShowInfo(opt.type)}
              onMouseLeave={() => setShowInfo(null)}
              className={`relative p-3 rounded-xl transition-all ${
                behavior.type === opt.type
                  ? "bg-violet-500 ring-2 ring-violet-300"
                  : "bg-slate-700 hover:bg-slate-600"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-2xl mb-1">{opt.icon}</div>
              <div className="text-xs text-white/80">{opt.name}</div>
            </motion.button>
          ))}
        </div>
        
        {/* Info tooltip */}
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 p-2 bg-slate-700 rounded-lg text-xs text-white/70 flex items-start gap-2"
          >
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-violet-400" />
            {BEHAVIOR_OPTIONS.find((b) => b.type === showInfo)?.preview}
          </motion.div>
        )}
      </div>

      {/* Speed Slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm text-white/70">Speed</label>
          <span className="text-xs text-white/50">
            {behavior.speed === 1 ? "Slow 🐢" : 
             behavior.speed === 2 ? "Normal 🚶" : 
             behavior.speed === 3 ? "Fast 🏃" : 
             behavior.speed >= 4 ? "Super Fast ⚡" : ""}
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={5}
          value={behavior.speed}
          onChange={(e) => onChange({ ...behavior, speed: parseInt(e.target.value) })}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
        />
        <div className="flex justify-between text-xs text-white/30 mt-1">
          <span>Slow</span>
          <span>Fast</span>
        </div>
      </div>

      {/* Range Slider (for patrol/fly/chase/zigzag/sine_wave/bounce) */}
      {(behavior.type === "patrol" || behavior.type === "fly" || behavior.type === "chase" || 
        behavior.type === "zigzag" || behavior.type === "sine_wave" || behavior.type === "bounce") && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-white/70">
              {behavior.type === "chase" ? "Detection Range" : "Movement Range"}
            </label>
            <span className="text-xs text-white/50">{behavior.range} tiles</span>
          </div>
          <input
            type="range"
            min={2}
            max={10}
            value={behavior.range}
            onChange={(e) => onChange({ ...behavior, range: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
          />
          <div className="flex justify-between text-xs text-white/30 mt-1">
            <span>Short</span>
            <span>Long</span>
          </div>
        </div>
      )}

      {/* Orbit Radius (for orbit behavior) */}
      {behavior.type === "orbit" && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-white/70">Orbit Radius</label>
            <span className="text-xs text-white/50">{behavior.orbitRadius || 3} tiles</span>
          </div>
          <input
            type="range"
            min={1}
            max={6}
            value={behavior.orbitRadius || 3}
            onChange={(e) => onChange({ ...behavior, orbitRadius: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
          />
          <div className="flex justify-between text-xs text-white/30 mt-1">
            <span>Small</span>
            <span>Large</span>
          </div>
        </div>
      )}

      {/* Teleport Cooldown (for teleport behavior) */}
      {behavior.type === "teleport" && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-white/70">Teleport Cooldown</label>
            <span className="text-xs text-white/50">{behavior.teleportCooldown || 2}s</span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            value={behavior.teleportCooldown || 2}
            onChange={(e) => onChange({ ...behavior, teleportCooldown: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
          />
          <div className="flex justify-between text-xs text-white/30 mt-1">
            <span>Fast</span>
            <span>Slow</span>
          </div>
        </div>
      )}

      {/* Jump Height (for jump behavior) */}
      {behavior.type === "jump" && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-white/70">Jump Height</label>
            <span className="text-xs text-white/50">{behavior.jumpHeight || 3} tiles</span>
          </div>
          <input
            type="range"
            min={1}
            max={5}
            value={behavior.jumpHeight || 3}
            onChange={(e) => onChange({ ...behavior, jumpHeight: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
          />
          <div className="flex justify-between text-xs text-white/30 mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
      )}

      {/* Preview Animation */}
      <div className="bg-slate-900 rounded-xl p-4">
        <div className="text-xs text-white/50 mb-2 text-center">Preview</div>
        <div className="h-16 relative overflow-hidden">
          <BehaviorPreview behavior={behavior} />
        </div>
      </div>
    </div>
  );
}

// Simple animated preview of the behavior
function BehaviorPreview({ behavior }: { behavior: EnemyBehavior }) {
  const getAnimation = () => {
    switch (behavior.type) {
      case "patrol":
        return {
          x: [0, 100, 0],
          transition: { duration: 4 / behavior.speed, repeat: Infinity, ease: "linear" }
        };
      case "chase":
        return {
          x: [0, 60, 80, 100],
          transition: { duration: 3 / behavior.speed, repeat: Infinity }
        };
      case "jump":
        return {
          x: [0, 50, 100],
          y: [0, -(behavior.jumpHeight || 3) * 8, 0, -(behavior.jumpHeight || 3) * 8, 0],
          transition: { duration: 3 / behavior.speed, repeat: Infinity }
        };
      case "fly":
        return {
          y: [-10, 10, -10],
          x: [0, 50, 100, 50, 0],
          transition: { duration: 4 / behavior.speed, repeat: Infinity, ease: "easeInOut" }
        };
      case "stationary":
        return {
          scale: [1, 1.1, 1],
          transition: { duration: 1, repeat: Infinity }
        };
      case "zigzag":
        return {
          x: [0, 25, 50, 75, 100],
          y: [0, -20, 0, -20, 0],
          transition: { duration: 3 / behavior.speed, repeat: Infinity, ease: "linear" }
        };
      case "sine_wave":
        return {
          x: [0, 25, 50, 75, 100],
          y: [0, -15, 0, 15, 0],
          transition: { duration: 4 / behavior.speed, repeat: Infinity, ease: "easeInOut" }
        };
      case "bounce":
        return {
          x: [0, 100, 0],
          y: [0, -20, 0, -20, 0],
          transition: { duration: 2.5 / behavior.speed, repeat: Infinity, ease: "easeOut" }
        };
      case "orbit":
        const radius = (behavior.orbitRadius || 3) * 8;
        return {
          x: [50 + radius, 50, 50 - radius, 50, 50 + radius],
          y: [0, -radius, 0, radius, 0],
          transition: { duration: 3 / behavior.speed, repeat: Infinity, ease: "linear" }
        };
      case "teleport":
        return {
          x: [20, 20, 80, 80, 50, 50, 20],
          opacity: [1, 0, 0, 1, 1, 0, 1],
          transition: { 
            duration: (behavior.teleportCooldown || 2) * 2, 
            repeat: Infinity,
            times: [0, 0.1, 0.15, 0.25, 0.5, 0.55, 0.65]
          }
        };
      default:
        return {
          scale: [1, 1.1, 1],
          transition: { duration: 1, repeat: Infinity }
        };
    }
  };

  return (
    <motion.div
      className="absolute w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center"
      style={{ left: 0, top: "50%", marginTop: -16 }}
      animate={getAnimation()}
    >
      <span className="text-lg">👾</span>
    </motion.div>
  );
}

