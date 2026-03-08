"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const SLIDES = [
  {
    image: "/slideshow/gamepath.png",
    title: "The journey laid out in front of them",
    description:
      "Your child sees exactly where they're going. Each game they build unlocks the next one. The path is clear, the progress is real, and the next mission is always one tap away.",
  },
  {
    image: "/slideshow/missions%20screen.png",
    title: "Clear steps. Real progress.",
    description:
      "Every mission is broken into bite-sized steps so your child always knows exactly what to do next. They complete one, unlock the next, and before long they've built a working game from scratch.",
  },
  {
    image: "/slideshow/main_ui.png",
    title: "Real code. Real output. Right now.",
    description:
      "No waiting for someone to mark their work. The moment they run their code, they see what it does. When it breaks, they fix it. That back-and-forth loop is where real learning happens.",
  },
  {
    image: "/slideshow/char-designer.png",
    title: "Their hero, their game",
    description:
      "Before writing a single line of code, they draw the character that stars in their game. It takes five minutes and makes everything that follows feel personal. They're not learning Python in the abstract. They're building their game.",
  },
  {
    image: "/slideshow/parent_dashboard.png",
    title: "You always know where they stand",
    description:
      "No vague 'they did some coding today.' You can see every mission, every step, and exactly how far they've got. Real visibility, no nagging required.",
  },
  {
    image: "/slideshow/parents_dashboard_cal.png",
    title: "Fits around your actual week",
    description:
      "Plan sessions around football practice, school clubs, and family days. DreamPaths sits alongside your family's routine rather than competing with it.",
  },
];

const SLIDE_DURATION = 6000;

export function AppScreensSlideshow() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startTimer() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, SLIDE_DURATION);
  }

  useEffect(() => {
    if (!paused) startTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  function goTo(i: number) {
    setCurrent(i);
    startTimer();
  }

  const slide = SLIDES[current];

  return (
    <div
      className="mt-16"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-8 max-w-2xl mx-auto px-4 h-24 flex flex-col justify-center"
        >
          <h3 className="text-xl font-bold text-[var(--color-navy)] mb-2">
            {slide.title}
          </h3>
          <p className="text-gray-600 leading-relaxed">{slide.description}</p>
        </motion.div>
      </AnimatePresence>

      {/* Image */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-[#f5f0eb] max-w-3xl mx-auto h-[480px]">
        <AnimatePresence>
          {SLIDES.map((s, i) =>
            i === current ? (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex items-center justify-center p-4"
              >
                <Image
                  src={s.image}
                  alt={s.title}
                  width={1280}
                  height={800}
                  className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg"
                  priority={i === 0}
                />
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center items-center gap-2 mt-5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-7 h-2 bg-[var(--color-violet)]"
                : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-3 max-w-xs mx-auto h-0.5 bg-gray-100 rounded-full overflow-hidden">
        {!paused && (
          <motion.div
            key={current}
            className="h-full bg-[var(--color-violet)] opacity-50"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
          />
        )}
      </div>
    </div>
  );
}
