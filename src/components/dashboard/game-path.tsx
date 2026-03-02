"use client";

import { motion } from "framer-motion";
import { GameNode } from "./game-node";
import type { PackProgress } from "@/lib/missions";

const PACK_DOT_COLORS: Record<string, string> = {
  snake_basics_v1: "border-emerald-500",
  platformer_v1: "border-violet-500",
  default: "border-blue-500",
};

interface GamePathProps {
  packs: PackProgress[];
  heroPixels?: string[][] | null;
}

/** Small pixel-art avatar for the "you are here" dot */
function HeroAvatar({ pixels }: { pixels: string[][] }) {
  return (
    <div className="grid" style={{ gridTemplateColumns: `repeat(16, 2px)`, imageRendering: "pixelated" }}>
      {pixels.map((row, y) =>
        row.map((color, x) => (
          <div
            key={`${x}-${y}`}
            style={{
              width: 2,
              height: 2,
              backgroundColor: color === "transparent" ? "transparent" : color,
            }}
          />
        ))
      )}
    </div>
  );
}

export function GamePath({ packs, heroPixels }: GamePathProps) {
  // The "current" pack is the first one that isn't locked and isn't fully complete
  const currentPackIndex = packs.findIndex(
    pp => !pp.locked && pp.completedMissionIds.length < pp.pack.missions.length
  );

  return (
    <div className="relative max-w-3xl mx-auto py-4 px-4">
      {/* Vertical connecting line */}
      <div
        className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-200 to-violet-300 -translate-x-1/2 z-0"
        aria-hidden="true"
      />

      <div className="space-y-16 relative z-10">
        {packs.map((packProgress, index) => {
          const isLeft = index % 2 === 0;
          const dotColor = PACK_DOT_COLORS[packProgress.pack.packId] ?? PACK_DOT_COLORS.default;
          const isCurrent = index === currentPackIndex;

          return (
            <div key={packProgress.pack.packId} className="flex items-center">
              {/* Left slot */}
              <div className="flex-1 flex justify-end pr-6">
                {isLeft ? (
                  <GameNode packProgress={packProgress} isLeft index={index} />
                ) : null}
              </div>

              {/* Dot / avatar on the line */}
              {isCurrent ? (
                <div className="relative shrink-0 z-10">
                  {/* Pulsing ring */}
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className={`absolute inset-0 rounded-full ${dotColor.replace("border-", "bg-")} -m-1`}
                  />
                  {heroPixels ? (
                    <div
                      className={`relative w-10 h-10 rounded-full bg-white border-4 ${dotColor} overflow-hidden shadow-lg flex items-center justify-center`}
                    >
                      <HeroAvatar pixels={heroPixels} />
                    </div>
                  ) : (
                    <div
                      className={`relative w-6 h-6 rounded-full bg-white border-4 ${dotColor} shadow-md`}
                    />
                  )}
                </div>
              ) : (
                <div
                  className={`w-4 h-4 rounded-full border-4 bg-white ${dotColor} shrink-0 z-10 shadow-sm`}
                />
              )}

              {/* Right slot */}
              <div className="flex-1 flex justify-start pl-6">
                {!isLeft ? (
                  <GameNode packProgress={packProgress} isLeft={false} index={index} />
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
