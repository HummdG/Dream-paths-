"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Loader2, CheckCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorText, setErrorText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (open && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [open]);

  function handleOpen() {
    setOpen(true);
    setStatus("idle");
    setMessage("");
    setEmail("");
    setErrorText("");
  }

  function handleClose() {
    setOpen(false);
    setStatus("idle");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus("submitting");
    setErrorText("");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, email: email || undefined, page: pathname }),
      });

      if (res.ok) {
        setStatus("success");
        setTimeout(() => setOpen(false), 2000);
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorText(data.error || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorText("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-3">
      {open && (
        <div className="w-80 rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-600 to-violet-600">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-white" />
              <span className="text-sm font-semibold text-white">Share Feedback</span>
            </div>
            <button
              onClick={handleClose}
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Close feedback"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {status === "success" ? (
            <div className="flex flex-col items-center gap-2 py-8 px-4 text-center">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
              <p className="font-semibold text-gray-800">Thanks for your feedback!</p>
              <p className="text-sm text-gray-500">We read every message.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What's on your mind?"
                rows={4}
                className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                maxLength={2000}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email (optional, for a reply)"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {status === "error" && (
                <p className="text-xs text-red-600">{errorText}</p>
              )}
              <button
                type="submit"
                disabled={status === "submitting" || !message.trim()}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Feedback
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}

      <button
        onClick={open ? handleClose : handleOpen}
        className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-lg ring-1 ring-black/10 hover:shadow-xl hover:text-indigo-600 hover:ring-indigo-200 transition-all"
        aria-label="Open feedback"
      >
        <MessageSquare className="w-4 h-4" />
        Feedback
      </button>
    </div>
  );
}
