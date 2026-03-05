"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface MissionTile {
  title: string;
  emoji: string;
}

interface PackSection {
  title: string;
  emoji: string;
  freeBadge?: boolean;
  pathBadge?: string;
  ringClass: string;
  missions: MissionTile[];
}

interface PathSlide {
  pathId: string;
  label: string;
  emoji: string;
  packs: PackSection[];
}

const PATH_SLIDES: PathSlide[] = [
  {
    pathId: "computer_scientist",
    label: "Computer Scientist",
    emoji: "💻",
    packs: [
      {
        title: "Snake Tutorial",
        emoji: "🐍",
        freeBadge: true,
        ringClass: "ring-2 ring-emerald-300 ring-offset-2",
        missions: [
          { title: "Hello Python", emoji: "🐍" },
          { title: "Functions & Movement", emoji: "⚙️" },
          { title: "Keyboard Controls", emoji: "⌨️" },
          { title: "Score & Game Over", emoji: "🏆" },
        ],
      },
      {
        title: "Platformer Game",
        emoji: "🎮",
        pathBadge: "Computer Scientist path",
        ringClass: "",
        missions: [
          { title: "Design Your Hero", emoji: "🎨" },
          { title: "Run & Explore", emoji: "🏃" },
          { title: "Build Your Scene", emoji: "🏗️" },
          { title: "Gravity & Jumping", emoji: "🦘" },
          { title: "Collisions", emoji: "💥" },
          { title: "Collect & Score", emoji: "🪙" },
          { title: "Enemies", emoji: "👾" },
          { title: "Win & Polish", emoji: "🏁" },
        ],
      },
    ],
  },
  {
    pathId: "astronaut",
    label: "Astronaut",
    emoji: "🚀",
    packs: [
      {
        title: "Space Cadet Program",
        emoji: "🛸",
        freeBadge: true,
        ringClass: "ring-2 ring-emerald-300 ring-offset-2",
        missions: [
          { title: "Mission Briefing", emoji: "📋" },
          { title: "Rocket Functions", emoji: "🔧" },
          { title: "Keyboard Controls", emoji: "⌨️" },
          { title: "Reach Orbit", emoji: "🌍" },
        ],
      },
      {
        title: "Space Explorer",
        emoji: "👨‍🚀",
        pathBadge: "Astronaut path",
        ringClass: "",
        missions: [
          { title: "Design Your Rocket", emoji: "🚀" },
          { title: "Gravity Simulation", emoji: "🌌" },
          { title: "Star Map", emoji: "⭐" },
          { title: "Mission Control", emoji: "🖥️" },
          { title: "Planet Landing", emoji: "🪐" },
          { title: "Alien Discovery", emoji: "👽" },
          { title: "Space Mission Complete", emoji: "🏆" },
          { title: "Build a Water Rocket", emoji: "💧" },
        ],
      },
    ],
  },
  {
    pathId: "doctor",
    label: "Doctor",
    emoji: "🩺",
    packs: [
      {
        title: "Junior Medic Academy",
        emoji: "🏥",
        freeBadge: true,
        ringClass: "ring-2 ring-emerald-300 ring-offset-2",
        missions: [
          { title: "First Day at the Hospital", emoji: "🏥" },
          { title: "Check the Vitals", emoji: "💓" },
          { title: "Alert System", emoji: "🚨" },
          { title: "Treatment Plan", emoji: "💊" },
        ],
      },
      {
        title: "Junior Doctor",
        emoji: "🩺",
        pathBadge: "Doctor path",
        ringClass: "",
        missions: [
          { title: "Design Your Doctor", emoji: "👨‍⚕️" },
          { title: "Body Systems Quiz", emoji: "🫀" },
          { title: "Dissect a Flower", emoji: "🌸" },
          { title: "Heartbeat Analyser", emoji: "📈" },
          { title: "First Aid Guide", emoji: "🩹" },
          { title: "Diagnosis Detective", emoji: "🔬" },
          { title: "Hospital Simulator", emoji: "🏨" },
          { title: "Build a Stethoscope", emoji: "🎧" },
        ],
      },
    ],
  },
];

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
                  <motion.div
                    key={mission.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.04 }}
                    className={`card p-5 text-center ${pack.ringClass}`}
                  >
                    <div className="text-3xl mb-2">{mission.emoji}</div>
                    <h3 className="text-sm font-bold text-[var(--color-navy)]">
                      {mission.title}
                    </h3>
                  </motion.div>
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
