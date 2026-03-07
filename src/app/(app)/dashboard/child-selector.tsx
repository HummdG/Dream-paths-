"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { LogOut, Settings } from "lucide-react";
import { motion } from "framer-motion";

interface ChildCard {
  childId: string;
  firstName: string;
  heroPixels: string[][] | null;
  completedMissions: number;
  totalMissions: number;
  totalStars: number;
}

interface ChildSelectorProps {
  parentName: string;
  childCards: ChildCard[];
}

export function ChildSelector({ parentName, childCards }: ChildSelectorProps) {
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-2 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="DreamPaths"
              width={550}
              height={180}
              priority
              className="h-12 sm:h-16 md:h-20 lg:h-24 w-auto"
            />
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Hi, {parentName}!</span>
            <Link
              href="/parent-dashboard"
              title="Parent dashboard"
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-2">
            Welcome back, {parentName}!
          </p>
          <h1 className="text-3xl font-bold text-[var(--color-navy)]">
            Who&apos;s learning today?
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {childCards.map((child, i) => (
            <motion.div
              key={child.childId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Link
                href={`/dashboard?childId=${child.childId}`}
                className="group block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-violet-200 transition-all duration-200"
              >
                {/* Hero section */}
                <div className="bg-gradient-to-br from-violet-50 to-indigo-50 p-6 flex flex-col items-center gap-3">
                  {child.heroPixels ? (
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-sm overflow-hidden flex items-center justify-center">
                      <div
                        className="grid"
                        style={{ gridTemplateColumns: "repeat(16, 5px)" }}
                      >
                        {child.heroPixels.map((row, y) =>
                          row.map((color, x) => (
                            <div
                              key={`${x}-${y}`}
                              style={{
                                width: 5,
                                height: 5,
                                backgroundColor:
                                  color === "transparent" ? "transparent" : color,
                              }}
                            />
                          ))
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border-2 border-dashed border-violet-300 flex items-center justify-center text-3xl">
                      🎨
                    </div>
                  )}
                  <h2 className="text-lg font-bold text-[var(--color-navy)] group-hover:text-violet-700 transition-colors">
                    {child.firstName}
                  </h2>
                </div>

                {/* Stats section */}
                <div className="px-5 py-4 flex items-center justify-between text-sm text-gray-500">
                  <span>
                    {child.completedMissions}/{child.totalMissions} missions
                  </span>
                  <span>⭐ {child.totalStars} stars</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
