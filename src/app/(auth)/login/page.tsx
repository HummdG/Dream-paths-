"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showVerified, setShowVerified] = useState(false);

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      setShowVerified(true);
      setTimeout(() => setShowVerified(false), 5000);
    }
    
    const errorParam = searchParams.get("error");
    if (errorParam === "missing-token") {
      setError("Verification link is invalid.");
    } else if (errorParam === "invalid-token") {
      setError("Verification link is invalid or has already been used.");
    } else if (errorParam === "expired-token") {
      setError("Verification link has expired. Please sign up again.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
      {/* Full-bleed background — behind absolutely everything */}
      <Image
        src="/computer_scientist_hero_background.png"
        alt=""
        fill
        className="object-cover object-center"
        priority
        aria-hidden="true"
      />
      {/* Fade layer — softens the image uniformly */}
      <div className="absolute inset-0 bg-indigo-950/70" />
      {/* Subtle vignette */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,15,0.45) 100%)" }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="card max-w-md w-full relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-4">
            <Image
              src="/logo1.png"
              alt="DreamPaths"
              width={450}
              height={150}
              priority
              className="h-20 sm:h-24 md:h-32 w-auto"
            />
          </Link>
          <div className="flex justify-center mb-4">
            <Image
              src="/codog_1.png"
              width={80}
              height={80}
              alt=""
              aria-hidden="true"
              className="w-16 sm:w-20 h-auto drop-shadow-md"
            />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-navy)] mb-2">
            Welcome back!
          </h1>
          <p className="text-gray-600">
            Sign in to continue the adventure
          </p>
        </div>

        {showVerified && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 text-green-700 p-4 rounded-xl text-sm flex items-center gap-2 mb-6"
          >
            <CheckCircle className="w-5 h-5" />
            Email verified! You can now sign in.
          </motion.div>
        )}

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
                placeholder="Your password"
                required
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

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/signup" className="text-[var(--color-violet)] hover:underline font-medium">
            Sign up free
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-indigo-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white/50" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

