"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PATH_SLIDES } from "@/lib/path-slides-data";

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

export function PathSlideshow() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  function goTo(index: number) {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }

  const slide = PATH_SLIDES[current];

  return (
    <div>
      {/* Path tabs */}
      <div className="flex justify-center gap-2 mb-10 flex-wrap">
        {PATH_SLIDES.map((s, i) => (
          <button
            key={s.pathId}
            onClick={() => goTo(i)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              i === current
                ? "bg-[var(--color-navy)] text-white shadow-md"
                : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            <span>{s.emoji}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Mission tiles */}
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={slide.pathId}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {slide.packs.map((pack) => (
            <div key={pack.title} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{pack.emoji}</span>
                <h3 className="text-lg font-bold text-gray-800">{pack.title}</h3>
                {pack.freeBadge && (
                  <span className="text-xs font-bold bg-emerald-500 text-white px-2.5 py-1 rounded-full">
                    FREE
                  </span>
                )}
                {pack.pathBadge && (
                  <span className="text-xs font-semibold text-violet-600 bg-violet-100 px-2.5 py-1 rounded-full">
                    {pack.pathBadge}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {pack.missions.map((mission, index) => (
                  <div
                    key={mission.title}
                    className={`card p-5 text-center ${pack.freeBadge ? "ring-2 ring-emerald-300 ring-offset-2" : ""}`}
                  >
                    <div className="text-3xl mb-2">{mission.emoji}</div>
                    <h3 className="text-sm font-bold text-[var(--color-navy)]">
                      {mission.title}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* CTA buttons */}
          <div className="flex justify-center gap-4 mt-4">
            <Link
              href={`/paths/${slide.pathId}`}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full border-2 border-[var(--color-navy)] text-[var(--color-navy)] text-sm font-semibold hover:bg-[var(--color-navy)] hover:text-white transition-colors"
            >
              Learn More
            </Link>
            <Link
              href="/signup"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[var(--color-indigo)] to-[var(--color-violet)] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
