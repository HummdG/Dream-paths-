import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, ArrowRight } from "lucide-react";
import { CAREER_PATHS, PATH_PACKS } from "@/lib/plans";
import { allMissionPacks } from "@/lib/missions";
import { PATH_SLIDES } from "@/lib/path-slides-data";

interface PathMarketingPageProps {
  params: Promise<{ pathId: string }>;
}

export default async function PathMarketingPage({ params }: PathMarketingPageProps) {
  const { pathId } = await params;
  const meta = CAREER_PATHS[pathId];
  if (!meta) notFound();

  const packIds = PATH_PACKS[pathId] ?? [];
  const packs = allMissionPacks.filter((p) => packIds.includes(p.packId));
  const slide = PATH_SLIDES.find((s) => s.pathId === pathId);

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-2 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo1.png"
              alt="DreamPaths"
              width={550}
              height={180}
              priority
              className="h-12 sm:h-16 w-auto"
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

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 px-6" style={{ minHeight: '400px' }}>
        {/* Background image — full opacity, path scene */}
        {meta.heroBackground ? (
          <Image
            src={meta.heroBackground}
            fill
            alt=""
            className="object-cover object-center"
            priority
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient}`} />
        )}
        {/* Colour tint overlay using path gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${meta.gradient} opacity-70`} />
        {/* Dark overlay on left to ensure text is readable */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 45%, transparent 70%)' }}
        />

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col md:flex-row items-end gap-8">
          <div className="text-left text-white flex-1 pb-4">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              {meta.label}
            </h1>
            <p className="text-lg text-white/85 max-w-xl mb-8">
              {meta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="flex items-center justify-center gap-2 bg-white text-[var(--color-navy)] font-bold px-8 py-3 rounded-full hover:bg-white/90 transition-colors"
              >
                Start Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#pricing"
                className="flex items-center justify-center px-8 py-3 rounded-full border-2 border-white/50 text-white font-semibold hover:bg-white/10 transition-colors"
              >
                See Pricing
              </Link>
            </div>
            <p className="mt-4 text-sm text-white/60">
              ✓ No credit card required &nbsp;·&nbsp; Free starter included
            </p>
          </div>
          {meta.heroCharacterImage && (
            <div className="hidden md:block shrink-0 self-end">
              <Image
                src={meta.heroCharacterImage}
                width={240}
                height={240}
                alt={meta.label}
                style={{ filter: 'drop-shadow(5px 10px 6px rgba(0,0,0,0.45))' }}
              />
            </div>
          )}
        </div>
      </section>

      {/* What you'll learn */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[var(--color-navy)] mb-8 text-center">
            What&apos;s included
          </h2>
          <ul className="grid sm:grid-cols-3 gap-4 mb-12">
            {meta.preview.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
              >
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{item}</span>
              </li>
            ))}
          </ul>

          {/* Mission tiles per pack */}
          {slide?.packs.map((pack) => (
            <div key={pack.title} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{pack.emoji}</span>
                <h3 className="text-lg font-bold text-gray-800">{pack.title}</h3>
                {pack.freeBadge && (
                  <span className="text-xs font-bold bg-emerald-500 text-white px-2.5 py-1 rounded-full">
                    FREE
                  </span>
                )}
                {pack.pathBadge && (
                  <span className="text-xs font-semibold text-violet-600 bg-violet-100 px-2.5 py-1 rounded-full">
                    {pack.pathBadge}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {pack.missions.map((mission) => (
                  <div
                    key={mission.title}
                    className={`card p-5 text-center ${pack.freeBadge ? "ring-2 ring-emerald-300 ring-offset-2" : ""}`}
                  >
                    <div className="text-3xl mb-2">{mission.emoji}</div>
                    <h3 className="text-sm font-bold text-[var(--color-navy)]">
                      {mission.title}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* More coming soon */}
          <div className="mt-2 mb-4 flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl">
            <span className="text-2xl">✨</span>
            <div>
              <p className="text-sm font-semibold text-violet-700">More missions on the way</p>
              <p className="text-xs text-gray-500 mt-0.5">New packs and sections are added regularly. Your child&apos;s path keeps growing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[var(--color-navy)] mb-3 text-center">
            Simple pricing
          </h2>
          <p className="text-gray-500 text-center mb-12">
            Start free. Unlock the full {meta.label} path when ready.
          </p>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {/* Free */}
            <div className="bg-white rounded-2xl p-6 flex flex-col border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 h-5">
                Free
              </p>
              <div className="mb-5 h-10 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[var(--color-navy)]">
                  £0
                </span>
                <span className="text-gray-400 text-sm">forever</span>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {[
                  "Free starter tutorial (4 missions)",
                  "Pixel art hero creator",
                  "Parent dashboard",
                  "1 child profile",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-gray-500"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="mt-auto w-full py-3 text-center rounded-full font-semibold text-sm border-2 border-gray-200 text-gray-500 hover:border-gray-300 transition-colors block"
              >
                Start Free
              </Link>
            </div>

            {/* This path */}
            <div className="bg-white rounded-2xl p-6 flex flex-col ring-2 ring-[var(--color-violet)]">
              <div className="flex items-center justify-between mb-3 h-5">
                <p className="text-xs font-semibold text-[var(--color-violet)] uppercase tracking-wide">
                  {meta.label}
                </p>
                <span className="bg-[var(--color-violet)] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  Popular
                </span>
              </div>
              <div className="mb-5 h-10 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[var(--color-navy)]">
                  £24.99
                </span>
                <span className="text-gray-400 text-sm">/month</span>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {[
                  "Everything in Free",
                  ...packs.slice(1).map(
                    (p) => `Full ${p.packTitle} (${p.missions.length} missions)`
                  ),
                  "1 child profile",
                  "Cancel anytime",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-gray-500"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-[var(--color-violet)] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="mt-auto w-full py-3 text-center rounded-full font-semibold text-sm bg-gradient-to-r from-[var(--color-indigo)] to-[var(--color-violet)] text-white hover:opacity-90 transition-opacity block"
              >
                Get Started
              </Link>
            </div>

            {/* Dream Studio */}
            <div className="bg-white rounded-2xl p-6 flex flex-col ring-2 ring-amber-400">
              <div className="flex items-center justify-between mb-3 h-5">
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
                  Dream Studio
                </p>
                <span className="bg-amber-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  All Access
                </span>
              </div>
              <div className="mb-5 h-10 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[var(--color-navy)]">
                  £39.99
                </span>
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
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-gray-500"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="mt-auto w-full py-3 text-center rounded-full font-semibold text-sm bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 transition-opacity block"
              >
                Get Dream Studio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/">
            <Image
              src="/logo1.png"
              alt="DreamPaths"
              width={200}
              height={65}
              className="h-12 w-auto"
            />
          </Link>
          <p className="text-gray-400 text-sm">
            © 2026 DreamPaths. Made with ❤️ for young creators.
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/" className="hover:text-[var(--color-violet)]">
              Home
            </Link>
            <Link href="#" className="hover:text-[var(--color-violet)]">
              Privacy
            </Link>
            <Link href="#" className="hover:text-[var(--color-violet)]">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
