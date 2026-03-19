"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Renders inline `code` spans inside a slide line
function InlineSlideText({ text }: { text: string }) {
  const parts = text.split(/`([^`]+)`/);
  return (
    <span>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <code
            key={i}
            className="bg-indigo-900/20 text-indigo-800 font-mono text-xs px-1.5 py-0.5 rounded mx-0.5"
          >
            {part}
          </code>
        ) : (
          part
        )
      )}
    </span>
  );
}

interface MascotGuideProps {
  slides: string[];
}

export function MascotGuide({ slides }: MascotGuideProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goNext = () => {
    if (current < slides.length - 1) {
      setDirection(1);
      setCurrent(c => c + 1);
    }
  };

  const goPrev = () => {
    if (current > 0) {
      setDirection(-1);
      setCurrent(c => c - 1);
    }
  };

  const goTo = (i: number) => {
    setDirection(i > current ? 1 : -1);
    setCurrent(i);
  };

  return (
    <div className="px-4 pt-3 pb-2">
      {/* Speech bubble + Codog row */}
      <div className="flex items-end gap-3">

        {/* Speech bubble — takes remaining width, tail points toward Codog */}
        <div className="flex-1 relative">
          <div className="bg-white border-2 border-indigo-200 rounded-2xl rounded-br-none p-3 min-h-[72px] shadow-sm">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={{
                  enter: (dir: number) => ({ x: dir * 30, opacity: 0 }),
                  center: { x: 0, opacity: 1 },
                  exit: (dir: number) => ({ x: dir * -30, opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.18 }}
                className="text-sm text-gray-800 leading-relaxed"
              >
                <InlineSlideText text={slides[current]} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Tail: small triangle bottom-right of bubble pointing toward Codog */}
          <div
            className="absolute -right-[9px] bottom-0 w-0 h-0"
            style={{
              borderTop: "9px solid transparent",
              borderLeft: "9px solid #c7d2fe", // indigo-200
            }}
          />
          <div
            className="absolute -right-[7px] bottom-0 w-0 h-0"
            style={{
              borderTop: "8px solid transparent",
              borderLeft: "8px solid white",
            }}
          />
        </div>

        {/* Codog — bottom-right anchor */}
        <div className="shrink-0 mb-0.5">
          <Image
            src="/codog_1.png"
            alt="Codog"
            width={64}
            height={64}
            className="rounded-xl drop-shadow-sm"
          />
        </div>
      </div>

      {/* Controls row — aligned left, leaving space for Codog width on the right */}
      <div className="flex items-center gap-2 mt-2 pr-[76px]">
        <button
          onClick={goPrev}
          disabled={current === 0}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
            current === 0
              ? "text-gray-300 cursor-not-allowed"
              : "text-indigo-600 hover:bg-indigo-50"
          }`}
        >
          Back
        </button>

        {/* Dots */}
        <div className="flex items-center gap-1.5 flex-1 justify-center">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === current
                  ? "bg-indigo-500 w-4"
                  : "bg-indigo-200 hover:bg-indigo-400 w-2"
              }`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          disabled={current === slides.length - 1}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
            current === slides.length - 1
              ? "text-gray-300 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
