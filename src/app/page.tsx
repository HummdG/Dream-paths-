"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, ArrowRight, Sparkles, Lock } from "lucide-react";

const CAREER_PATHS = [
  {
    label: 'Computer Scientist',
    emoji: '💻',
    tagline: 'Learn Python by building real games',
    available: true,
    badge: 'Available now',
    preview: ['Snake Tutorial (free)', 'Platformer Game', 'More coming…'],
  },
  {
    label: 'Astronaut',
    emoji: '🚀',
    tagline: 'Maths, physics & space science',
    available: false,
    badge: 'Coming soon',
    preview: [],
  },
  {
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

const snakeMissions = [
  { title: "Hello Python", emoji: "🐍" },
  { title: "Functions & Movement", emoji: "⚙️" },
  { title: "Keyboard Controls", emoji: "⌨️" },
  { title: "Score & Game Over", emoji: "🏆" },
]

const platformerMissions = [
  { title: "Design Your Hero", emoji: "🎨" },
  { title: "Run & Explore", emoji: "🏃" },
  { title: "Build Your Scene", emoji: "🏗️" },
  { title: "Gravity & Jumping", emoji: "🦘" },
  { title: "Collisions", emoji: "💥" },
  { title: "Collect & Score", emoji: "🪙" },
  { title: "Enemies", emoji: "👾" },
  { title: "Win & Polish", emoji: "🏁" },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
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
                  <motion.div
                    key={path.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
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
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* "Choose Your Dream Path" section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-navy)] mb-4">
              Choose Your Dream Path
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each path takes your child from complete beginner to something they've actually built.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {CAREER_PATHS.map((path, i) => (
              <motion.div
                key={path.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`card relative overflow-hidden ${!path.available ? 'opacity-70' : 'card-interactive'}`}
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
                  <ul className="space-y-1.5">
                    {path.preview.map(item => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-navy)] mb-4">
              How it works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start free. One mission a week, at your own pace.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-indigo)] to-[var(--color-violet)] rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                  {item.emoji}
                </div>
                <div className="text-xs font-bold text-[var(--color-violet)] mb-1 uppercase tracking-wide">
                  Step {item.step}
                </div>
                <h3 className="text-lg font-bold text-[var(--color-navy)] mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Computer Scientist path missions detail */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🐍</span>
              <h3 className="text-lg font-bold text-gray-800">Snake Tutorial</h3>
              <span className="text-xs font-bold bg-emerald-500 text-white px-2.5 py-1 rounded-full">FREE</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {snakeMissions.map((mission, index) => (
                <motion.div
                  key={mission.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="card p-5 text-center ring-2 ring-emerald-300 ring-offset-2"
                >
                  <div className="text-3xl mb-2">{mission.emoji}</div>
                  <h3 className="text-sm font-bold text-[var(--color-navy)]">{mission.title}</h3>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🎮</span>
              <h3 className="text-lg font-bold text-gray-800">Platformer Game</h3>
              <span className="text-xs font-semibold text-violet-600 bg-violet-100 px-2.5 py-1 rounded-full">Computer Scientist path</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {platformerMissions.map((mission, index) => (
                <motion.div
                  key={mission.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="card p-5 text-center"
                >
                  <div className="text-3xl mb-2">{mission.emoji}</div>
                  <h3 className="text-sm font-bold text-[var(--color-navy)]">{mission.title}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-navy)] mb-4">
              Simple, family-friendly pricing
            </h2>
            <p className="text-lg text-gray-600">
              Start free. One mission a week, at your own pace.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 flex flex-col border border-gray-100"
            >
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
            </motion.div>

            {/* Computer Scientist Path */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 flex flex-col ring-2 ring-[var(--color-violet)]"
            >
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
            </motion.div>

            {/* Dream Studio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 flex flex-col ring-2 ring-amber-400"
            >
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
            </motion.div>
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
            <Link href="#" className="hover:text-[var(--color-violet)]">Privacy</Link>
            <Link href="#" className="hover:text-[var(--color-violet)]">Terms</Link>
            <Link href="#" className="hover:text-[var(--color-violet)]">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
