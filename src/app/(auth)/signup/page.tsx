"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { LegalModal } from "@/components/legal/legal-modal";

function PlanCapture() {
  const searchParams = useSearchParams();
  useEffect(() => {
    const plan = searchParams.get("plan");
    if (plan) {
      localStorage.setItem("dreampaths_signup_plan", plan);
    }
  }, [searchParams]);
  return null;
}

const features = [
  {
    title: "Build real projects from day one",
    desc: "Kids write Python that powers games, space missions, and medical simulations they design themselves.",
  },
  {
    title: "Step-by-step guided missions",
    desc: "Every concept broken into small steps with instant, encouraging feedback.",
  },
  {
    title: "Three career paths to explore",
    desc: "Computer Scientist, Astronaut, or Doctor. Every path teaches real programming skills.",
  },
  {
    title: "Safe and built for ages 8-14",
    desc: "No ads, no social feeds. Just focused, joyful learning.",
  },
];

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <PageShell>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card max-w-md w-full text-center"
        >
          <div className="flex justify-center mb-6">
            <Image src="/codog_4.png" width={96} height={96} alt="" aria-hidden="true" className="w-20 sm:w-24 h-auto drop-shadow-lg" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-navy)] mb-4">Check your email!</h1>
          <p className="text-gray-600 mb-6">
            We've sent a verification link to <strong>{email}</strong>. Click the link to activate your account.
          </p>
          <p className="text-sm text-gray-500">
            Didn't receive it? Check your spam folder or{" "}
            <button onClick={() => setSuccess(false)} className="text-[var(--color-violet)] hover:underline">
              try again
            </button>
          </p>
        </motion.div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Suspense fallback={null}><PlanCapture /></Suspense>

      <div className="w-full max-w-5xl mx-auto flex items-center justify-center gap-16 lg:gap-24 px-6 py-12">

        {/* Left info — hidden on mobile */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="hidden lg:flex flex-col flex-1 max-w-sm"
        >
          <p className="text-violet-300 text-xs font-bold tracking-widest uppercase mb-4" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.7)" }}>
            Kids coding platform
          </p>
          <h2 className="text-4xl font-bold text-white leading-tight mb-5" style={{ textShadow: "0 2px 16px rgba(0,0,0,0.8)" }}>
            Start your child's<br />coding adventure
          </h2>
          <p className="text-white/80 text-base leading-relaxed mb-12" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}>
            DreamPaths teaches kids aged 8–14 to code in Python by building games, simulations, and real projects.
          </p>

          <ul className="space-y-7">
            {features.map(({ title, desc }, i) => (
              <motion.li
                key={title}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.2 + i * 0.09, ease: "easeOut" }}
                className="flex items-start gap-3"
              >
                <span className="shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full bg-violet-400" />
                <div>
                  <p className="text-white font-semibold text-sm mb-0.5" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.75)" }}>{title}</p>
                  <p className="text-white/70 text-sm leading-relaxed" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.7)" }}>{desc}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Right — original card, unchanged */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="card w-full max-w-md shrink-0"
        >
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center mb-4">
              <Image src="/logo1.png" alt="DreamPaths" width={450} height={150} priority className="h-20 sm:h-24 md:h-32 w-auto" />
            </Link>
            <div className="flex justify-center mb-4">
              <Image src="/codog_5.png" width={80} height={80} alt="" aria-hidden="true" className="w-16 sm:w-20 h-auto drop-shadow-md" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--color-navy)] mb-2">Create your account</h1>
            <p className="text-gray-600">Start your child's creative coding journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-600 p-4 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-12"
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-[var(--color-violet)] shrink-0 cursor-pointer"
              />
              <span className="text-sm text-gray-600 leading-snug">
                I agree to the{" "}
                <button type="button" onClick={() => setShowTerms(true)} className="text-[var(--color-violet)] hover:underline font-medium">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button type="button" onClick={() => setShowPrivacy(true)} className="text-[var(--color-violet)] hover:underline font-medium">
                  Privacy Policy
                </button>
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading || !agreedToTerms}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" />Creating account...</>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--color-violet)] hover:underline font-medium">Sign in</Link>
          </p>
        </motion.div>
      </div>

      {showPrivacy && <LegalModal type="privacy" onClose={() => setShowPrivacy(false)} />}
      {showTerms && <LegalModal type="terms" onClose={() => setShowTerms(false)} />}
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Full-bleed background — behind absolutely everything */}
      <Image
        src="/astronaut_hero_background.png"
        alt=""
        fill
        className="object-cover object-center"
        priority
        aria-hidden="true"
      />
      {/* Base dark tint over the whole image */}
      <div className="absolute inset-0 bg-indigo-950/60" />
      {/* Heavy left scrim so text is always legible */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(10,5,40,0.90) 0%, rgba(10,5,40,0.80) 40%, rgba(10,5,40,0.30) 65%, transparent 100%)" }} />
      <div className="relative z-10 w-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export default function SignUpPageWrapper() {
  return (
    <Suspense fallback={null}>
      <SignUpPage />
    </Suspense>
  );
}
