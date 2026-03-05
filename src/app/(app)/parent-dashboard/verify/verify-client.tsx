"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, KeyRound, Loader2 } from "lucide-react";

type Stage = "request" | "enter";

interface VerifyClientProps {
  expired: boolean;
}

export function VerifyClient({ expired }: VerifyClientProps) {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("request");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRequestPin() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/parent/request-pin", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
      } else {
        setStage("enter");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyPin(e: React.FormEvent) {
    e.preventDefault();
    if (pin.length !== 6) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/parent/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
      } else {
        router.push("/parent-dashboard");
        router.refresh();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handlePinInput(value: string) {
    // Strip non-digits and cap at 6
    setPin(value.replace(/\D/g, "").slice(0, 6));
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-violet-600" />
            </div>
          </div>

          <h1 className="text-xl font-bold text-[var(--color-navy)] text-center mb-1">
            Parent Dashboard
          </h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            This area is protected. We&apos;ll send a one-time PIN to your email to verify it&apos;s you.
          </p>

          {/* Expired warning */}
          {expired && (
            <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
              Your session expired. Please verify again.
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {error}
            </div>
          )}

          {stage === "request" ? (
            <button
              onClick={handleRequestPin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-violet-600 hover:to-indigo-700 transition-all disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Mail className="w-4 h-4" />
              )}
              Send me a PIN
            </button>
          ) : (
            <form onSubmit={handleVerifyPin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5" />
                  Enter your 6-digit PIN
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => handlePinInput(e.target.value)}
                  placeholder="000000"
                  autoFocus
                  className="w-full text-center text-2xl font-mono tracking-[0.5em] border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1.5 text-center">
                  Expires in 15 minutes
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || pin.length !== 6}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-violet-600 hover:to-indigo-700 transition-all disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                Verify PIN
              </button>

              <button
                type="button"
                onClick={() => {
                  setStage("request");
                  setPin("");
                  setError(null);
                }}
                className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Send a new PIN instead
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
