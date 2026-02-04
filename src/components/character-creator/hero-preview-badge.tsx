"use client";

import { motion } from "framer-motion";

interface HeroPreviewBadgeProps {
  pixels: string[][];
  name?: string;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  animate?: boolean;
}

const sizes = {
  sm: 2,
  md: 4,
  lg: 6,
};

export function HeroPreviewBadge({
  pixels,
  name,
  size = "md",
  showName = false,
  animate = false,
}: HeroPreviewBadgeProps) {
  const pixelSize = sizes[size];
  const gridSize = pixels.length;

  const content = (
    <div className="flex flex-col items-center">
      <div
        className="bg-gradient-to-br from-violet-100 to-indigo-100 p-2 rounded-xl"
        style={{
          boxShadow: "0 2px 8px rgba(139, 92, 246, 0.2)",
        }}
      >
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, ${pixelSize}px)`,
            imageRendering: "pixelated",
          }}
        >
          {pixels.map((row, y) =>
            row.map((color, x) => (
              <div
                key={`${x}-${y}`}
                style={{
                  width: pixelSize,
                  height: pixelSize,
                  backgroundColor:
                    color === "transparent" ? "transparent" : color,
                }}
              />
            ))
          )}
        </div>
      </div>
      {showName && name && (
        <p className="text-xs font-medium text-violet-700 mt-1 truncate max-w-full">
          {name}
        </p>
      )}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        animate={{
          y: [0, -3, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}


