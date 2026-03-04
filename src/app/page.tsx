"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Gamepad2, Star, CheckCircle, ArrowRight, Sparkles, Crown } from "lucide-react";

const features = [
  {
    icon: Gamepad2,
    title: "Real Game Projects",
    description: "Kids build actual games they can play and share with friends.",
  },
  {
    icon: Star,
    title: "Weekly Missions",
    description: "Bite-sized 30-45 minute missions that fit into busy schedules.",
  },
  {
    icon: CheckCircle,
    title: "Progress You Can See",
    description: "Track every milestone from your parent dashboard.",
  },
];

const snakeMissions = [
  { title: "Hello Python", emoji: "🐍" },
  { title: "Functions & Movement", emoji: "⚙️" },
  { title: "Keyboard Controls", emoji: "⌨️" },
  { title: "Score & Game Over", emoji: "🏆" },
];

const platformerMissions = [
  { title: "Design Your Hero", emoji: "🎨" },
  { title: "Run & Explore", emoji: "🏃" },
  { title: "Build Your Scene", emoji: "🏗️" },
  { title: "Gravity & Jumping", emoji: "🦘" },
  { title: "Collisions", emoji: "💥" },
  { title: "Collect & Score", emoji: "🪙" },
  { title: "Enemies", emoji: "👾" },
  { title: "Win & Polish", emoji: "🏁" },
];

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
                For kids aged 8-12
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--color-navy)] leading-tight mb-6">
                Turn your child's{" "}
                <span className="bg-gradient-to-r from-[var(--color-indigo)] to-[var(--color-violet)] bg-clip-text text-transparent">
                  love of games
                </span>{" "}
                into real skills
              </h1>
              
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Guided weekly missions that teach game design, creativity, and coding fundamentals. 
                Watch your child go from player to creator in just 4 weeks.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup" className="btn-primary text-center flex items-center justify-center gap-2">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="#how-it-works" className="btn-secondary text-center">
                  See How It Works
                </Link>
              </div>
              
              <p className="mt-4 text-sm text-gray-500">
                ✓ No credit card required &nbsp; ✓ First 2 missions free
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {/* Hero illustration - stylized mission card */}
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-[var(--color-mint)] rounded-full opacity-50 animate-float" />
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[var(--color-peach)] rounded-full opacity-50 animate-float delay-300" />
                
                <div className="card relative z-10 p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-indigo)] to-[var(--color-violet)] rounded-2xl flex items-center justify-center text-3xl">
                      🎮
                    </div>
                    <div>
                      <p className="text-sm text-[var(--color-violet)] font-medium">Mission 1</p>
                      <h3 className="text-xl font-bold text-[var(--color-navy)]">Design Your Hero</h3>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-6">
                    Create the main character for your very first game! Draw them, name them, and give them special powers.
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    {["Draw or sketch your hero", "Write their backstory", "List 3 special abilities"].map((step, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-[var(--color-mint)] flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="text-gray-700">{step}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">⏱️ ~30 minutes</span>
                    <button className="bg-[var(--color-indigo)] text-white px-6 py-2 rounded-full font-medium text-sm hover:bg-[var(--color-violet)] transition-colors">
                      Start Mission
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-navy)] mb-4">
              Learning that feels like play
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each mission is designed by educators to be fun, challenging, and achievable.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card card-interactive text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-indigo)] to-[var(--color-violet)] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[var(--color-navy)] mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works / Mission Path */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-navy)] mb-4">
              The Junior Game Developer Path
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Learn real Python by building games from scratch — starting with a free Snake tutorial, then a full platformer.
            </p>
          </motion.div>

          {/* Snake Tutorial — FREE */}
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

          {/* Platformer Game */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🎮</span>
              <h3 className="text-lg font-bold text-gray-800">Platformer Game</h3>
              <span className="text-xs font-semibold text-violet-600 bg-violet-100 px-2.5 py-1 rounded-full">Full subscription</span>
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
              Start free. Upgrade when you're ready.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card"
            >
              <h3 className="text-xl font-bold text-[var(--color-navy)] mb-2">Free</h3>
              <p className="text-gray-600 mb-6">The full Snake tutorial, forever free</p>
              <div className="text-4xl font-bold text-[var(--color-navy)] mb-6">
                £0 <span className="text-base font-normal text-gray-500">forever</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Full Snake tutorial (4 missions)", "Pixel art hero creator", "Parent dashboard", "1 child profile"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="btn-secondary w-full text-center block">
                Start Free
              </Link>
            </motion.div>

            {/* Founding Family */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="card ring-2 ring-[var(--color-violet)] relative"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[var(--color-indigo)] to-[var(--color-violet)] text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" />
                Most Popular
              </div>
              <h3 className="text-xl font-bold text-[var(--color-navy)] mb-2">Founding Family</h3>
              <p className="text-gray-600 mb-6">Full access to all games and missions</p>
              <div className="text-4xl font-bold text-[var(--color-navy)] mb-6">
                £24.99 <span className="text-base font-normal text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["All missions unlocked", "Snake + Platformer paths", "Up to 2 child profiles", "Priority support", "Cancel anytime"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-[var(--color-violet)]" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="btn-primary w-full text-center block">
                Get Started
              </Link>
            </motion.div>

            {/* Dream Studio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="card ring-2 ring-amber-400 relative"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Star className="w-3.5 h-3.5" />
                Dream Studio
              </div>
              <h3 className="text-xl font-bold text-[var(--color-navy)] mb-2">Dream Studio</h3>
              <p className="text-gray-600 mb-6">Unlimited creativity, unlimited kids</p>
              <div className="text-4xl font-bold text-[var(--color-navy)] mb-6">
                £39.99 <span className="text-base font-normal text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["Everything in Founding Family", "Unlimited child profiles", "All current + future paths", "Dedicated support", "Founding member badge"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-amber-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="w-full text-center block py-3 px-6 rounded-xl font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all">
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
