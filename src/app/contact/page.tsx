"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";

const CONTACT_TYPES = [
  { value: "question", label: "I have a question" },
  { value: "feedback", label: "I have feedback" },
  { value: "help", label: "I need help" },
  { value: "complaint", label: "I have a complaint" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", type: "question", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong.");
        setStatus("error");
      } else {
        setStatus("success");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-2 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="DreamPaths"
              width={550}
              height={180}
              priority
              className="h-12 sm:h-16 md:h-20 lg:h-24 w-auto"
            />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-[var(--color-navy)] hover:text-[var(--color-violet)] font-medium transition-colors"
            >
              Log in
            </Link>
            <Link href="/signup" className="btn-primary py-2 px-6 text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-40 pb-20 px-6">
        <div className="max-w-xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[var(--color-violet)] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="card">
            <div className="mb-8">
              <h1 className="text-2xl font-extrabold text-[var(--color-navy)] mb-2">Get in touch</h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                Have a question, some feedback, or need a hand? Fill in the form below and we'll get back to you as soon as we can.
              </p>
            </div>

            {status === "success" ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-lg font-bold text-[var(--color-navy)] mb-2">Message sent!</h2>
                <p className="text-gray-500 text-sm mb-6">
                  Thanks for reaching out. We'll get back to you within 1–2 business days.
                </p>
                <button
                  onClick={() => { setForm({ name: "", email: "", type: "question", message: "" }); setStatus("idle"); }}
                  className="text-sm text-[var(--color-violet)] hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-navy)] mb-1.5">
                      Your name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Jane Smith"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-violet)] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-navy)] mb-1.5">
                      Email address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="jane@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-violet)] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-navy)] mb-1.5">
                    What is this about?
                  </label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-violet)] focus:border-transparent bg-white"
                  >
                    {CONTACT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-navy)] mb-1.5">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us what's on your mind…"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-violet)] focus:border-transparent resize-none"
                  />
                </div>

                {status === "error" && (
                  <p className="text-red-500 text-sm">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                  {status === "loading" ? "Sending…" : "Send message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
