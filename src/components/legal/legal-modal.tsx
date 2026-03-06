"use client";

import { useEffect } from "react";
import Link from "next/link";

const PRIVACY_CONTENT = (onClose: () => void) => (
  <div className="overflow-y-auto overscroll-contain p-6 text-sm text-gray-600 space-y-4 leading-relaxed flex-1 min-h-0">
    <p className="text-xs text-gray-400">Last updated: January 2026</p>
    <p>DreamPaths (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting the privacy of children and families who use our platform.</p>
    <h3 className="font-semibold text-[var(--color-navy)]">Information We Collect</h3>
    <p>We collect the minimum information necessary to provide our service: parent email address, child first name, and learning progress data. We do not collect a child&apos;s surname, date of birth, or any unnecessary personal details.</p>
    <h3 className="font-semibold text-[var(--color-navy)]">How We Use Your Information</h3>
    <p>Your information is used solely to operate the platform, send account-related emails (such as verification and mission updates), and provide parent progress reports. We do not sell your data or use it for advertising.</p>
    <h3 className="font-semibold text-[var(--color-navy)]">Children&apos;s Privacy</h3>
    <p>DreamPaths is designed for children aged 8–14 with parental consent. All child accounts are created and managed by a parent or guardian. We take children&apos;s privacy seriously and comply with applicable laws including COPPA and GDPR.</p>
    <h3 className="font-semibold text-[var(--color-navy)]">Data Storage &amp; Security</h3>
    <p>All data is stored securely on encrypted servers. We use industry-standard security practices to protect your information from unauthorised access.</p>
    <h3 className="font-semibold text-[var(--color-navy)]">Third-Party Services</h3>
    <p>We use Stripe for payment processing and Resend for transactional emails. These services have their own privacy policies and we only share the minimum data required for them to function.</p>
    <h3 className="font-semibold text-[var(--color-navy)]">Your Rights</h3>
    <p>You have the right to access, correct, or delete your personal data at any time. To exercise these rights, contact us via the Contact page.</p>
    <h3 className="font-semibold text-[var(--color-navy)]">Cookies</h3>
    <p>We use only essential session cookies required for authentication. We do not use tracking or advertising cookies.</p>
    <h3 className="font-semibold text-[var(--color-navy)]">Contact</h3>
    <p>For any privacy-related questions, please use the <Link href="/contact" className="text-[var(--color-violet)] hover:underline" onClick={onClose}>Contact page</Link>.</p>
  </div>
);

const TERMS_CONTENT = (onClose: () => void) => (
  <div className="overflow-y-auto overscroll-contain p-6 text-sm text-gray-600 space-y-4 leading-relaxed flex-1 min-h-0">
    <p className="text-xs text-gray-400">Last updated: January 2026</p>
    <p>By using DreamPaths, you agree to these Terms of Service. Please read them carefully.</p>
    <h3 className="font-semibold text-[var(--color-navy)]">The Service</h3>
    <p>DreamPaths provides an online educational platform for children aged 8–14. Parents register on behalf of their children and are responsible for ensuring appropriate use of the platform.</p>
    <h3 className="font-semibold text-[var(--color-navy)]">Accounts</h3>
    <p>You must be 18 or older to create an account. You are responsible for maintaining the security of your account credentials and for all activity that occurs under your account.</p>
    <h3 className="font-semibold text-[var(--color-navy)]">Acceptable Use</h3>
    <p>You agree not to misuse the platform, attempt to circumvent security measures, or use it in any way that could harm other users, children, or the service itself. The platform is for personal, non-commercial educational use only.</p>
    <h3 className="font-semibold text-[var(--color-navy)]">Subscriptions &amp; Payments</h3>
    <p>Paid plans are billed monthly. You may cancel at any time and will retain access until the end of the billing period. We do not offer refunds for partial months unless required by law.</p>
    <h3 className="font-semibold text-[var(--color-navy)]">Intellectual Property</h3>
    <p>All platform content, including lessons, missions, and code, is owned by DreamPaths. Code your child writes during missions belongs to you. You may not copy or redistribute our course materials.</p>
    <h3 className="font-semibold text-[var(--color-navy)]">Disclaimer</h3>
    <p>DreamPaths is provided &quot;as is&quot;. We make no guarantees about specific educational outcomes. We may update or modify the platform&apos;s content and features over time.</p>
    <h3 className="font-semibold text-[var(--color-navy)]">Termination</h3>
    <p>We reserve the right to suspend or terminate accounts that violate these terms. You may close your account at any time by contacting us.</p>
    <h3 className="font-semibold text-[var(--color-navy)]">Contact</h3>
    <p>For questions about these terms, please use the <Link href="/contact" className="text-[var(--color-violet)] hover:underline" onClick={onClose}>Contact page</Link>.</p>
  </div>
);

interface LegalModalProps {
  type: "privacy" | "terms";
  onClose: () => void;
}

export function LegalModal({ type, onClose }: LegalModalProps) {
  // Lock body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const title = type === "privacy" ? "Privacy Policy" : "Terms of Service";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop — no blur for smooth performance */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full flex flex-col" style={{ maxHeight: "80vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-bold text-[var(--color-navy)]">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors text-xl leading-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Scrollable body */}
        {type === "privacy" ? PRIVACY_CONTENT(onClose) : TERMS_CONTENT(onClose)}
      </div>
    </div>
  );
}
