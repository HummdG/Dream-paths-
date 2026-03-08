"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowRight, ArrowLeft, Loader2, CheckCircle } from "lucide-react";

const steps = [
  { id: 1, title: "Your name" },
  { id: 2, title: "Your child" },
  { id: 3, title: "Choose path" },
];

function Step3Content({ signupPlan, childName }: { signupPlan: string | null; childName: string }) {
  if (signupPlan === "computer_scientist") {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">💻</div>
          <h1 className="text-2xl font-bold text-[var(--color-navy)] mb-2">
            {childName}&apos;s Computer Scientist path
          </h1>
          <p className="text-gray-600">Ready to begin the adventure!</p>
        </div>

        <div className="card ring-2 ring-[var(--color-violet)] ring-offset-2">
          <h3 className="text-lg font-bold text-[var(--color-navy)] mb-1">Junior Game Developer</h3>
          <p className="text-sm text-gray-500 mb-4">
            Learn Python by building real games from scratch. No experience needed.
          </p>
          <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
            <span>🎮 12 missions</span>
            <span>⏱️ 30–45 min each</span>
            <span className="text-xs font-semibold bg-emerald-500 text-white px-2 py-0.5 rounded-full">
              Snake tutorial is free
            </span>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400">You can add other career paths later</p>
      </div>
    );
  }

  if (signupPlan === "astronaut") {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🚀</div>
          <h1 className="text-2xl font-bold text-[var(--color-navy)] mb-2">
            {childName}&apos;s Astronaut path
          </h1>
          <p className="text-gray-600">Ready to begin the adventure!</p>
        </div>

        <div className="card ring-2 ring-[var(--color-violet)] ring-offset-2">
          <h3 className="text-lg font-bold text-[var(--color-navy)] mb-1">Space Explorer</h3>
          <p className="text-sm text-gray-500 mb-4">
            Maths, physics and space science through hands-on missions.
          </p>
          <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
            <span>🌌 12 missions</span>
            <span>⏱️ 30–45 min each</span>
            <span className="text-xs font-semibold bg-emerald-500 text-white px-2 py-0.5 rounded-full">
              Space Cadet Program is free
            </span>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400">You can add other career paths later</p>
      </div>
    );
  }

  if (signupPlan === "doctor") {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🩺</div>
          <h1 className="text-2xl font-bold text-[var(--color-navy)] mb-2">
            {childName}&apos;s Doctor path
          </h1>
          <p className="text-gray-600">Ready to begin the adventure!</p>
        </div>

        <div className="card ring-2 ring-[var(--color-violet)] ring-offset-2">
          <h3 className="text-lg font-bold text-[var(--color-navy)] mb-1">Junior Doctor</h3>
          <p className="text-sm text-gray-500 mb-4">
            Biology, anatomy and medical science through real experiments.
          </p>
          <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
            <span>🔬 12 missions</span>
            <span>⏱️ 30–45 min each</span>
            <span className="text-xs font-semibold bg-emerald-500 text-white px-2 py-0.5 rounded-full">
              Junior Medic Academy is free
            </span>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400">You can add other career paths later</p>
      </div>
    );
  }

  if (signupPlan === "dream_studio") {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">✨</div>
          <h1 className="text-2xl font-bold text-[var(--color-navy)] mb-2">
            {childName} gets access to everything
          </h1>
          <p className="text-gray-600">Dream Studio unlocks all career paths</p>
        </div>

        <div className="card space-y-3">
          {[
            { emoji: "💻", label: "Computer Scientist" },
            { emoji: "🚀", label: "Astronaut" },
            { emoji: "🩺", label: "Doctor" },
          ].map((path) => (
            <div key={path.label} className="flex items-center gap-3">
              <span className="text-xl">{path.emoji}</span>
              <span className="text-sm font-medium text-[var(--color-navy)] flex-1">{path.label}</span>
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            </div>
          ))}
          <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
            <span className="text-xl">🔮</span>
            <span className="text-sm text-gray-500 flex-1">All future paths included</span>
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
          </div>
        </div>

        <p className="text-center text-xs text-gray-400">
          Dream Studio includes all current and future career paths
        </p>
      </div>
    );
  }

  // Generic / no plan
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-[var(--color-navy)] mb-2">
          Everything starts free
        </h1>
        <p className="text-gray-600">
          {childName} gets free access to the starter missions on all 3 career paths
        </p>
      </div>

      <div className="card space-y-3">
        {[
          { emoji: "💻", label: "Computer Scientist" },
          { emoji: "🚀", label: "Astronaut" },
          { emoji: "🩺", label: "Doctor" },
        ].map((path) => (
          <div key={path.label} className="flex items-center gap-3">
            <span className="text-xl">{path.emoji}</span>
            <span className="text-sm font-medium text-[var(--color-navy)] flex-1">{path.label}</span>
            <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
              Free
            </span>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400">
        Upgrade to unlock a full career path whenever you&apos;re ready
      </p>
    </div>
  );
}

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
  const [signupPlan, setSignupPlan] = useState<string | null>(null);

  useEffect(() => {
    const plan = localStorage.getItem("dreampaths_signup_plan");
    setSignupPlan(plan);
  }, []);

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
          signupPlan,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      localStorage.removeItem("dreampaths_signup_plan");
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
        <div className="flex items-center mb-10">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    currentStep > step.id
                      ? "bg-gradient-to-br from-[var(--color-indigo)] to-[var(--color-violet)] text-white"
                      : currentStep === step.id
                      ? "bg-gradient-to-br from-[var(--color-indigo)] to-[var(--color-violet)] text-white ring-4 ring-violet-100"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="w-3.5 h-3.5" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`text-[11px] font-medium whitespace-nowrap transition-colors duration-300 ${
                    currentStep >= step.id ? "text-[var(--color-navy)]" : "text-gray-400"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 mx-3 mb-5">
                  <div className="h-px bg-gray-200 relative overflow-hidden rounded-full">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--color-indigo)] to-[var(--color-violet)] transition-all duration-500"
                      style={{ width: currentStep > step.id ? "100%" : "0%" }}
                    />
                  </div>
                </div>
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
                  Welcome! Let&apos;s get started
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
                  We&apos;ll personalize their learning journey
                </p>
              </div>

              <div>
                <label htmlFor="childName" className="block text-sm font-medium text-gray-700 mb-2">
                  Child&apos;s first name
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
                  max="18"
                  value={childAge}
                  onChange={(e) => setChildAge(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-violet)]"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>6</span>
                  <span>18</span>
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
            >
              <Step3Content signupPlan={signupPlan} childName={childName} />
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
                  Start {childName}&apos;s Journey
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
