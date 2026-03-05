"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { LogOut, Settings, ShieldCheck } from "lucide-react";
import { ChildProgressCard } from "@/components/parent-dashboard/child-progress-card";
import type { ChildData } from "@/components/parent-dashboard/child-progress-card";

interface ParentDashboardClientProps {
  parentName: string;
  childrenData: ChildData[];
}

export function ParentDashboardClient({ parentName, childrenData }: ParentDashboardClientProps) {
  const children = childrenData;
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
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-violet-500" />
              Parent View
            </span>
            <Link
              href="/parent-dashboard/settings"
              title="Account settings"
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--color-navy)]">
            Hi, {parentName}!
          </h1>
          <p className="text-gray-500 mt-1">
            Here&apos;s how your {children.length === 1 ? "child is" : "children are"} progressing.
          </p>
        </div>

        {children.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
            <p className="text-gray-500">No children added yet.</p>
            <Link
              href="/dashboard"
              className="mt-4 inline-block text-sm text-violet-600 hover:underline"
            >
              Go to dashboard to get started
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {children.map((child) => (
              <ChildProgressCard key={child.childId} child={child} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
