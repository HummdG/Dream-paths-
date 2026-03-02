"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowRight, ArrowLeft, Loader2, User, Baby, Gamepad2 } from "lucide-react";

const steps = [
  { id: 1, title: "Your Name", icon: User },
  { id: 2, title: "Your Child", icon: Baby },
  { id: 3, title: "Choose Path", icon: Gamepad2 },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [parentName, setParentName] = useState("");
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState(10);
  const [selectedPath] = useState("junior_game_dev");

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentName,
          childName,
          childAge,
          pathId: selectedPath,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const canProgress = () => {
    if (currentStep === 1) return parentName.trim().length > 0;
    if (currentStep === 2) return childName.trim().length > 0;
    return true;
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] bg-dots flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card max-w-lg w-full"
      >
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  currentStep >= step.id
                    ? "bg-gradient-to-br from-[var(--color-indigo)] to-[var(--color-violet)] text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                <step.icon className="w-5 h-5" />
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-1 mx-2 rounded transition-all ${
                    currentStep > step.id ? "bg-[var(--color-violet)]" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6"
          >
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">👋</div>
                <h1 className="text-2xl font-bold text-[var(--color-navy)] mb-2">
                  Welcome! Let's get started
                </h1>
                <p className="text-gray-600">
                  First, tell us what to call you
                </p>
              </div>

              <div>
                <label htmlFor="parentName" className="block text-sm font-medium text-gray-700 mb-2">
                  Your first name
                </label>
                <input
                  type="text"
                  id="parentName"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="input-field text-lg"
                  placeholder="e.g., Sarah"
                  autoFocus
                />
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">🧒</div>
                <h1 className="text-2xl font-bold text-[var(--color-navy)] mb-2">
                  Tell us about your child
                </h1>
                <p className="text-gray-600">
                  We'll personalize their learning journey
                </p>
              </div>

              <div>
                <label htmlFor="childName" className="block text-sm font-medium text-gray-700 mb-2">
                  Child's first name
                </label>
                <input
                  type="text"
                  id="childName"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="input-field text-lg"
                  placeholder="e.g., Alex"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age: {childAge} years old
                </label>
                <input
                  type="range"
                  min="6"
                  max="14"
                  value={childAge}
                  onChange={(e) => setChildAge(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-violet)]"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>6</span>
                  <span>14</span>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">🎮</div>
                <h1 className="text-2xl font-bold text-[var(--color-navy)] mb-2">
                  {childName}'s Dream Path
                </h1>
                <p className="text-gray-600">
                  Ready to begin the adventure!
                </p>
              </div>

              {/* Path card */}
              <div className="card ring-2 ring-[var(--color-violet)] ring-offset-2">
                <h3 className="text-lg font-bold text-[var(--color-navy)] mb-1">
                  Junior Game Developer
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {childName} will learn real Python by building games from scratch — no experience needed.
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                  <span>🎯 15 missions</span>
                  <span>⏱️ 30–45 min each</span>
                  <span>🐍 Real Python</span>
                  <span className="text-xs font-semibold bg-emerald-500 text-white px-2 py-0.5 rounded-full">Snake tutorial is free</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          {currentStep > 1 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-[var(--color-navy)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              disabled={!canProgress()}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={isLoading}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  Start {childName}'s Journey
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}






