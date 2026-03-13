"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { LogOut, Settings, ShieldCheck, UserPlus, X, Loader2, CheckCircle2 } from "lucide-react";
import { ChildProgressCard } from "@/components/parent-dashboard/child-progress-card";
import { CalendarTab } from "@/components/parent-dashboard/calendar/calendar-tab";
import type { ChildData } from "@/components/parent-dashboard/child-progress-card";
import { PLANS } from "@/lib/plans";

type ActiveTab = "progress" | "calendar";

interface ParentDashboardClientProps {
  parentName: string;
  childrenData: ChildData[];
  subscriptionPlan: string;
  childJustAdded?: boolean;
}

export function ParentDashboardClient({
  parentName,
  childrenData,
  subscriptionPlan,
  childJustAdded = false,
}: ParentDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("progress");
  const [showAddChild, setShowAddChild] = useState(false);
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState(10);
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState("");

  const isDreamStudio = subscriptionPlan === PLANS.DREAM_STUDIO;

  async function handleAddChild(e: React.FormEvent) {
    e.preventDefault();
    setAddError("");
    setIsAdding(true);

    try {
      if (isDreamStudio) {
        // Create child directly for Dream Studio
        const res = await fetch("/api/children", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName: childName, age: childAge }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        // Reload to show new child
        window.location.reload();
      } else {
        // Go to Stripe checkout for £3.99/month
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "add_child",
            childFirstName: childName,
            childAge,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        if (data.url) window.location.href = data.url;
      }
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsAdding(false);
    }
  }

  function openModal() {
    setChildName("");
    setChildAge(10);
    setAddError("");
    setShowAddChild(true);
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-2 flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center">
            <Image
              src="/logo1.png"
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
        {/* Greeting */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-navy)]">
              Hi, {parentName}!
            </h1>
            <p className="text-gray-500 mt-1">
              Track progress and plan learning sessions for your{" "}
              {childrenData.length === 1 ? "child" : "children"}.
            </p>
          </div>

          <button
            onClick={openModal}
            className="shrink-0 flex items-center gap-2 text-sm font-semibold bg-violet-600 text-white px-4 py-2 rounded-xl hover:bg-violet-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Add a Child
          </button>
        </div>

        {/* Child added success banner */}
        {childJustAdded && (
          <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              Your new child profile has been added and their account is ready to go!
            </span>
          </div>
        )}

        {/* Tab pills */}
        <div className="flex gap-2 mb-6">
          {(["progress", "calendar"] as ActiveTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-4 py-1.5 rounded-full text-sm font-medium transition-colors
                ${activeTab === tab
                  ? "bg-violet-600 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }
              `}
            >
              {tab === "progress" ? "Progress" : "Calendar"}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "progress" && (
          childrenData.length === 0 ? (
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
              {childrenData.map((child) => (
                <ChildProgressCard key={child.childId} child={child} />
              ))}
            </div>
          )
        )}

        {activeTab === "calendar" && (
          <CalendarTab childrenData={childrenData} />
        )}
      </main>

      {/* Add Child Modal */}
      {showAddChild && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowAddChild(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[var(--color-navy)]">
                Add a Child
              </h2>
              <button
                onClick={() => setShowAddChild(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!isDreamStudio && (
              <div className="mb-5 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
                Each additional child costs <strong>£3.99/month</strong>. You will be taken to a secure payment page.
              </div>
            )}

            {addError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                {addError}
              </div>
            )}

            <form onSubmit={handleAddChild} className="space-y-4">
              <div>
                <label
                  htmlFor="add-child-name"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Child&apos;s first name
                </label>
                <input
                  id="add-child-name"
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="input-field"
                  placeholder="e.g. Alex"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Age: {childAge} years old
                </label>
                <input
                  type="range"
                  min="6"
                  max="14"
                  value={childAge}
                  onChange={(e) => setChildAge(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-violet)]"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>6</span>
                  <span>14</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddChild(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding || !childName.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {isAdding ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isDreamStudio ? "Adding..." : "Redirecting..."}
                    </>
                  ) : isDreamStudio ? (
                    "Add Child"
                  ) : (
                    "Continue to Payment"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
