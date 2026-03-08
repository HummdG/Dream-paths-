"use client";

import { motion } from "framer-motion";
import { PathCard } from "./path-card";
import type { PackProgress } from "@/lib/missions";

export interface CareerPathEntry {
  pathId: string;
  packsProgress: PackProgress[];
}

interface CareerPathGridProps {
  careerPaths: CareerPathEntry[];
}

export function CareerPathGrid({ careerPaths }: CareerPathGridProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-[var(--color-navy)] mb-5">
        Your Dream Paths
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {careerPaths.map((entry, i) => (
          <motion.div
            key={entry.pathId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <PathCard entry={entry} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
