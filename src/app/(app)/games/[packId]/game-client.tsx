"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { ArrowLeft, LogOut } from "lucide-react";
import { CodingMissions } from "@/components/dashboard/coding-missions";
import type { MissionPack } from "@/lib/missions";

interface GameClientProps {
  pack: MissionPack;
  completedMissionIds: string[];
  totalStars: number;
  badges: string[];
}

export function GameClient({ pack, completedMissionIds, totalStars, badges }: GameClientProps) {
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-2 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="DreamPaths"
              width={550}
              height={180}
              priority
              className="h-12 sm:h-16 md:h-20 lg:h-24 w-auto"
            />
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Journey
        </Link>

        <CodingMissions
          pack={pack}
          completedMissionIds={completedMissionIds}
          totalStars={totalStars}
          badges={badges}
        />
      </main>
    </div>
  );
}
