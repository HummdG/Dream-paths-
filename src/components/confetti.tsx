"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const colors = [
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#f472b6", // pink
  "#fb923c", // orange
  "#a7f3d0", // mint
  "#fde68a", // yellow
  "#7dd3fc", // sky
];

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  rotation: number;
  color: string;
  size: number;
  shape: "circle" | "square" | "star";
}

export function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const newPieces: ConfettiPiece[] = [];
    for (let i = 0; i < 100; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 6,
        shape: ["circle", "square", "star"][Math.floor(Math.random() * 3)] as "circle" | "square" | "star",
      });
    }
    setPieces(newPieces);
  }, []);

  return (
    <div className="confetti-container">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            top: -20,
            left: `${piece.x}%`,
            rotate: piece.rotation,
            opacity: 1,
          }}
          animate={{
            top: "110%",
            rotate: piece.rotation + 720,
            opacity: 0,
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: piece.delay,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: piece.shape === "circle" ? "50%" : piece.shape === "star" ? "2px" : "2px",
            transform: piece.shape === "star" ? "rotate(45deg)" : undefined,
          }}
        />
      ))}
    </div>
  );
}

