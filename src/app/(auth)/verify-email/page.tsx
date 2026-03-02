"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] bg-dots flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card max-w-md w-full text-center"
      >
        <div className="text-6xl mb-6">📧</div>
        <h1 className="text-2xl font-bold text-[var(--color-navy)] mb-4">
          Check your email
        </h1>
        <p className="text-gray-600 mb-6">
          We've sent you a verification link. Click the link in the email to activate your account.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          The link will expire in 24 hours. Check your spam folder if you don't see it.
        </p>
        <Link href="/login" className="btn-secondary">
          Back to Sign In
        </Link>
      </motion.div>
    </div>
  );
}






