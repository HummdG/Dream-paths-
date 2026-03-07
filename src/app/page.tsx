"use client";

import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, ArrowRight, Sparkles, Lock } from "lucide-react";
import { PathSlideshow } from "@/components/homepage/path-slideshow";
import { LegalModal } from "@/components/legal/legal-modal";

const LOGOS = [
  { src: "/meta-brand-color.svg", alt: "Meta", width: 120, height: 48 },
  { src: "/google-brand-color.svg", alt: "Google", width: 120, height: 48 },
  { src: "/Imperial_logo.svg.png", alt: "Imperial College London", width: 180, height: 48 },
  { src: "/goldmansachs_logo.svg", alt: "Goldman Sachs", width: 160, height: 48 },
  { src: "/hcltechlogo.svg", alt: "HCLTech", width: 120, height: 48 },
  { src: "/snpglobal_logo.svg", alt: "S&P Global", width: 140, height: 48 },
  { src: "/ibm_logo.svg", alt: "IBM", width: 100, height: 48 },
  { src: "/pwc_logo.svg", alt: "PwC", width: 100, height: 48 },
  { src: "/uber_logo.svg", alt: "Uber", width: 100, height: 48 },
];

// NUM_COPIES must match the number of [...Array(N)] below
const NUM_COPIES = 4;

function LogoMarquee({ speed = 80 }: { speed?: number }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const baseX = useMotionValue(0);

  useAnimationFrame((_t, delta) => {
    if (!scrollerRef.current) return;
    const oneSetPx = scrollerRef.current.scrollWidth / NUM_COPIES;
    let next = baseX.get() - speed * (delta / 1000);
    if (next <= -oneSetPx) next += oneSetPx;
    baseX.set(next);
  });

  return (
    <div className="overflow-hidden">
      <motion.div ref={scrollerRef} className="flex w-max" style={{ x: baseX }}>
        {[...Array(NUM_COPIES)].flatMap((_, i) =>
          LOGOS.map((logo) => (
            <div key={`${i}-${logo.alt}`} className="shrink-0 flex items-center px-14">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="h-10 w-auto opacity-60 hover:opacity-90 transition-opacity"
              />
            </div>
          ))
        )}
      </motion.div>
    </div>
  );
}

const CAREER_PATHS = [
  {
    pathId: 'computer_scientist',
    label: 'Computer Scientist',
    emoji: '💻',
    tagline: 'Learn Python by building real games',
    available: true,
    badge: 'Available now',
    preview: ['Snake Tutorial (free)', 'Platformer Game', 'More coming…'],
  },
  {
    pathId: 'astronaut',
    label: 'Astronaut',
    emoji: '🚀',
    tagline: 'Maths, physics & space science',
    available: true,
    badge: 'Available now',
    preview: ['Space Cadet Program (free)', 'Space Explorer', 'More coming…'],
  },
  {
    pathId: 'doctor',
    label: 'Doctor',
    emoji: '🩺',
    tagline: 'Biology, anatomy & medical science',
    available: true,
    badge: 'Available now',
    preview: ['Junior Medic Academy (free)', 'Junior Doctor', 'More coming…'],
  },
  {
    pathId: null,
    label: 'AI Engineer',
    emoji: '🤖',
    tagline: 'Machine learning & data science',
    available: false,
    badge: 'Coming soon',
    preview: [],
  },
]

const HOW_IT_WORKS = [
  {
    step: '1',
    emoji: '🎯',
    title: 'Pick a dream career',
    description: 'Choose from Computer Scientist, Astronaut, AI Engineer, and more paths coming soon.',
  },
  {
    step: '2',
    emoji: '🚀',
    title: 'Complete one mission a week',
    description: 'Each mission takes around 30 to 45 minutes. Short enough to fit around school, long enough to feel like real progress.',
  },
  {
    step: '3',
    emoji: '🏆',
    title: 'Build a real portfolio',
    description: 'Every mission produces something real: a working game, a program, a project to be proud of.',
  },
]

export default function Home() {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

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
            <Link
              href="/signup"
              className="btn-primary py-2 px-6 text-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-dots">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-[var(--color-peach)] text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                For kids aged 8–14
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--color-navy)] leading-tight mb-6">
                Help your child discover their{" "}
                <span className="bg-gradient-to-r from-[var(--color-indigo)] to-[var(--color-violet)] bg-clip-text text-transparent">
                  dream career
                </span>
              </h1>

              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                Kids pick a career they love and learn towards it through hands-on missions that build real skills along the way.
              </p>

              <div className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm mb-8">
                🗓️ One mission a week. Fits around school.
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup" className="btn-primary text-center flex items-center justify-center gap-2">
                  Start Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="#how-it-works" className="btn-secondary text-center">
                  See How It Works
                </Link>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                ✓ No credit card required &nbsp; ✓ Full Snake tutorial free forever
              </p>
            </motion.div>

            {/* Career path preview cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-[var(--color-mint)] rounded-full opacity-50 animate-float" />
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[var(--color-peach)] rounded-full opacity-50 animate-float delay-300" />

              <div className="relative z-10 space-y-3">
                {CAREER_PATHS.map((path, i) => (
                  <div
                    key={path.label}
                    className={`card p-4 flex items-center gap-4 ${!path.available ? 'opacity-60' : ''}`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                      path.available
                        ? 'bg-gradient-to-br from-[var(--color-indigo)] to-[var(--color-violet)]'
                        : 'bg-gray-100'
                    }`}>
                      {path.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-[var(--color-navy)] text-sm">{path.label}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          path.available
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {path.badge}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{path.tagline}</p>
                    </div>
                    {!path.available && <Lock className="w-4 h-4 text-gray-300 shrink-0" />}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* "Choose Your Dream Path" section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-navy)] mb-4">
              Choose Your Dream Path
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each path takes your child from complete beginner to something they've actually built.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {CAREER_PATHS.map((path, i) => (
              <div
                key={path.label}
                className={`card relative overflow-hidden flex flex-col ${!path.available ? 'opacity-70' : 'card-interactive'}`}
              >
                {!path.available && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-2xl">
                    <div className="flex flex-col items-center gap-2">
                      <Lock className="w-8 h-8 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-500">Coming Soon</span>
                    </div>
                  </div>
                )}

                <div className="text-5xl mb-4">{path.emoji}</div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-[var(--color-navy)]">{path.label}</h3>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    path.available
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {path.badge}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{path.tagline}</p>
                {path.preview.length > 0 && (
                  <ul className="space-y-1.5 mb-5 flex-1">
                    {path.preview.map(item => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                {path.available && path.pathId && (
                  <div className="flex gap-2 mt-auto pt-2">
                    <Link
                      href={`/paths/${path.pathId}`}
                      className="flex-1 text-center py-2 rounded-full border-2 border-[var(--color-navy)] text-[var(--color-navy)] text-xs font-semibold hover:bg-[var(--color-navy)] hover:text-white transition-colors"
                    >
                      Learn More
                    </Link>
                    <Link
                      href="/signup"
                      className="flex-1 text-center py-2 rounded-full bg-gradient-to-r from-[var(--color-indigo)] to-[var(--color-violet)] text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-navy)] mb-4">
              How it works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three steps from zero to something you built yourself.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-indigo)] to-[var(--color-violet)] rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                  {item.emoji}
                </div>
                <div className="text-xs font-bold text-[var(--color-violet)] mb-1 uppercase tracking-wide">
                  Step {item.step}
                </div>
                <h3 className="text-lg font-bold text-[var(--color-navy)] mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>

          <PathSlideshow />
        </div>
      </section>

      {/* Why DreamPaths Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-navy)] mb-4">
              Why parents choose DreamPaths
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 — Learning by doing */}
            <div className="card text-center">
              <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[var(--color-indigo)] to-[var(--color-violet)] flex items-center justify-center text-2xl">
                🚀
              </div>
              <h3 className="text-lg font-bold text-[var(--color-navy)] mb-2">
                They build something real
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Every mission produces something your child made from scratch. Real projects, real skills, and something worth showing off at the end.
              </p>
            </div>

            {/* Card 2 — Transparency */}
            <div className="card text-center">
              <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-2xl">
                👀
              </div>
              <h3 className="text-lg font-bold text-[var(--color-navy)] mb-2">
                Full visibility for parents
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                A dedicated parent dashboard shows every mission, step, and star earned. Regular email updates keep you in the loop without any screen-time battles.
              </p>
            </div>

            {/* Card 3 — Value */}
            <div className="card text-center">
              <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl">
                💡
              </div>
              <h3 className="text-lg font-bold text-[var(--color-navy)] mb-2">
                Better value than a tutor
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                A private tutor costs £50 to £80 per hour. DreamPaths is a fraction of that, and your child builds a real project they can be proud of rather than doing worksheet drills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-10 bg-white border-y border-gray-100 overflow-hidden">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 text-center mb-7">
          Trusted by professionals at
        </p>
        <LogoMarquee />
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-navy)] mb-4">
              Simple, family-friendly pricing
            </h2>
            <p className="text-lg text-gray-600">
              Start free. One mission a week, at your own pace.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-6 flex flex-col border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 h-5">Free</p>
              <div className="mb-5 h-10 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[var(--color-navy)]">£0</span>
                <span className="text-gray-400 text-sm">forever</span>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {[
                  "Full Snake Tutorial (4 missions)",
                  "Pixel art hero creator",
                  "Parent dashboard",
                  "1 child profile",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="mt-auto w-full py-3 text-center rounded-full font-semibold text-sm border-2 border-gray-200 text-gray-500 hover:border-gray-300 transition-colors block">
                Start Free
              </Link>
            </div>

            {/* Computer Scientist Path */}
            <div className="bg-white rounded-2xl p-6 flex flex-col ring-2 ring-[var(--color-violet)]">
              <div className="flex items-center justify-between mb-3 h-5">
                <p className="text-xs font-semibold text-[var(--color-violet)] uppercase tracking-wide">Computer Scientist</p>
                <span className="bg-[var(--color-violet)] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">Popular</span>
              </div>
              <div className="mb-5 h-10 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[var(--color-navy)]">£24.99</span>
                <span className="text-gray-400 text-sm">/month</span>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {[
                  "Full Snake Tutorial (4 missions)",
                  "Full Platformer Game (8 missions)",
                  "12 missions total",
                  "1 child profile",
                  "Cancel anytime",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle className="w-3.5 h-3.5 text-[var(--color-violet)] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="mt-auto w-full py-3 text-center rounded-full font-semibold text-sm bg-gradient-to-r from-[var(--color-indigo)] to-[var(--color-violet)] text-white hover:opacity-90 transition-opacity block">
                Get Started
              </Link>
            </div>

            {/* Dream Studio */}
            <div className="bg-white rounded-2xl p-6 flex flex-col ring-2 ring-amber-400">
              <div className="flex items-center justify-between mb-3 h-5">
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Dream Studio</p>
                <span className="bg-amber-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">All Access</span>
              </div>
              <div className="mb-5 h-10 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[var(--color-navy)]">£39.99</span>
                <span className="text-gray-400 text-sm">/month</span>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {[
                  "All current career paths",
                  "All future career paths",
                  "Unlimited child profiles",
                  "Priority support",
                  "Cancel anytime",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="mt-auto w-full py-3 text-center rounded-full font-semibold text-sm bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 transition-opacity block">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center">
            <Image
              src="/logo.svg"
              alt="DreamPaths"
              width={320}
              height={105}
              priority
              className="h-16 sm:h-20 md:h-24 w-auto"
            />
          </div>
          <p className="text-gray-500 text-sm">
            © 2026 DreamPaths. Made with ❤️ for young creators.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <button onClick={() => setShowPrivacy(true)} className="hover:text-[var(--color-violet)] transition-colors">Privacy</button>
            <button onClick={() => setShowTerms(true)} className="hover:text-[var(--color-violet)] transition-colors">Terms</button>
            <Link href="/contact" className="hover:text-[var(--color-violet)] transition-colors">Contact</Link>
          </div>
        </div>
      </footer>

      {showPrivacy && <LegalModal type="privacy" onClose={() => setShowPrivacy(false)} />}
      {showTerms && <LegalModal type="terms" onClose={() => setShowTerms(false)} />}
    </div>
  );
}
