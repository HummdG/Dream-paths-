"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LegalModal } from "@/components/legal/legal-modal";

const CONSENT_KEY = "dp_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(CONSENT_KEY, "true");
    setVisible(false);
  }

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg"
          >
            <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--color-navy)] mb-0.5">
                  Cookies on DreamPaths
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  We use only essential cookies to keep you signed in. No tracking, no ads.{" "}
                  <button
                    onClick={() => setShowPrivacy(true)}
                    className="text-[var(--color-violet)] hover:underline font-medium"
                  >
                    View our Privacy Policy
                  </button>
                </p>
              </div>
              <button
                onClick={dismiss}
                className="btn-primary py-2 px-6 text-sm shrink-0"
              >
                Got it
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showPrivacy && (
        <LegalModal type="privacy" onClose={() => setShowPrivacy(false)} />
      )}
    </>
  );
}
