"use client";

import { SessionProvider } from "next-auth/react";
import { CookieBanner } from "@/components/cookie-banner";
import { FeedbackButton } from "@/components/feedback-button";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <CookieBanner />
      <FeedbackButton />
    </SessionProvider>
  );
}






