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

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] bg-dots flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card max-w-md w-full text-center"
        >
          <div className="text-6xl mb-6">📧</div>
          <h1 className="text-2xl font-bold text-[var(--color-navy)] mb-4">
            Check your email!
          </h1>
          <p className="text-gray-600 mb-6">
            We've sent a verification link to <strong>{email}</strong>. 
            Click the link to activate your account.
          </p>
          <p className="text-sm text-gray-500">
            Didn't receive it? Check your spam folder or{" "}
            <button 
              onClick={() => setSuccess(false)}
              className="text-[var(--color-violet)] hover:underline"
            >
              try again
            </button>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)] bg-dots flex items-center justify-center p-6">
      <Suspense fallback={null}>
        <PlanCapture />
      </Suspense>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card max-w-md w-full"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-6">
            <Image 
              src="/logo.svg" 
              alt="DreamPaths" 
              width={450} 
              height={150} 
              priority
              className="h-20 sm:h-24 md:h-32 w-auto"
            />
          </Link>
          <h1 className="text-2xl font-bold text-[var(--color-navy)] mb-2">
            Create your account
          </h1>
          <p className="text-gray-600">
            Start your child's creative coding journey
          </p>
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
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
              <button
                type="button"
                onClick={() => setShowTerms(true)}
                className="text-[var(--color-violet)] hover:underline font-medium"
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button
                type="button"
                onClick={() => setShowPrivacy(true)}
                className="text-[var(--color-violet)] hover:underline font-medium"
              >
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
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--color-violet)] hover:underline font-medium">
            Sign in
          </Link>
        </p>

      </motion.div>

      {showPrivacy && <LegalModal type="privacy" onClose={() => setShowPrivacy(false)} />}
      {showTerms && <LegalModal type="terms" onClose={() => setShowTerms(false)} />}
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

