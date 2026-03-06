"use client";

import { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import { format } from "date-fns";
import type { CalendarEventData } from "./month-grid";
import type { ChildData } from "@/components/parent-dashboard/child-progress-card";

interface EventModalProps {
  /** null = create mode; CalendarEventData = edit mode */
  event: CalendarEventData | null;
  initialDate: Date | null;
  childrenData: ChildData[];
  onClose: () => void;
  onSaved: () => void;
}

function toDateTimeLocal(iso: string) {
  // datetime-local input expects "YYYY-MM-DDTHH:mm"
  return iso.slice(0, 16);
}

function nowDateTimeLocal() {
  return toDateTimeLocal(new Date().toISOString());
}

function dateToDateTimeLocal(d: Date) {
  // Adjust for local timezone offset so the input shows local time
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 16);
}

export function EventModal({ event, initialDate, childrenData, onClose, onSaved }: EventModalProps) {
  const isEdit = event !== null;

  const defaultStart = initialDate
    ? dateToDateTimeLocal(initialDate)
    : nowDateTimeLocal();

  const [title, setTitle] = useState(event?.title ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [startAt, setStartAt] = useState(isEdit ? toDateTimeLocal(event!.startAt) : defaultStart);
  const [endAt, setEndAt] = useState(isEdit && event?.endAt ? toDateTimeLocal(event.endAt) : "");
  const [isDreampaths, setIsDreampaths] = useState(event?.isDreampaths ?? false);
  const [childId, setChildId] = useState(event?.childId ?? "");
  const [packId, setPackId] = useState(event?.packId ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Available packs for selected child
  const selectedChild = childrenData.find((c) => c.childId === childId);
  const availablePacks = selectedChild?.packs ?? [];

  // Reset packId when child changes
  useEffect(() => {
    if (!availablePacks.find((p) => p.packId === packId)) {
      setPackId("");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childId]);

  async function handleSave() {
    if (!title.trim()) { setError("Title is required."); return; }
    if (!startAt) { setError("Start date/time is required."); return; }

    setSaving(true);
    setError(null);

    const body = {
      title: title.trim(),
      description: description.trim() || undefined,
      startAt: new Date(startAt).toISOString(),
      endAt: endAt ? new Date(endAt).toISOString() : undefined,
      isDreampaths,
      childId: isDreampaths && childId ? childId : undefined,
      packId: isDreampaths && packId ? packId : undefined,
    };

    const url = isEdit ? `/api/parent/calendar/${event!.id}` : "/api/parent/calendar";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);

    if (!res.ok) {
      setError("Failed to save event. Please try again.");
      return;
    }

    onSaved();
  }

  async function handleDelete() {
    if (!isEdit) return;
    setDeleting(true);

    const res = await fetch(`/api/parent/calendar/${event!.id}`, { method: "DELETE" });

    setDeleting(false);

    if (!res.ok) {
      setError("Failed to delete event.");
      return;
    }

    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg text-gray-900">
            {isEdit ? "Edit Event" : "Add Event"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-3">
          {/* Title */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Python session with Emma"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          {/* Start */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Date and time *</label>
            <input
              type="datetime-local"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          {/* End */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">End time (optional)</label>
            <input
              type="datetime-local"
              value={endAt}
              onChange={(e) => setEndAt(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          {/* DreamPaths toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={isDreampaths}
                onChange={(e) => setIsDreampaths(e.target.checked)}
              />
              <div className={`w-10 h-5 rounded-full transition-colors ${isDreampaths ? "bg-violet-500" : "bg-gray-200"}`} />
              <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${isDreampaths ? "translate-x-5" : ""}`} />
            </div>
            <span className="text-sm text-gray-700">This is a DreamPaths session</span>
          </label>

          {/* Child + Pack (only when isDreampaths) */}
          {isDreampaths && (
            <>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Child</label>
                <select
                  value={childId}
                  onChange={(e) => setChildId(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
                >
                  <option value="">Select a child</option>
                  {childrenData.map((c) => (
                    <option key={c.childId} value={c.childId}>{c.firstName}</option>
                  ))}
                </select>
              </div>

              {availablePacks.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-gray-600 mb-1 block">Pack (optional)</label>
                  <select
                    value={packId}
                    onChange={(e) => setPackId(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
                  >
                    <option value="">Any pack</option>
                    {availablePacks.map((p) => (
                      <option key={p.packId} value={p.packId}>{p.packTitle}</option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Notes (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Any extra details..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          {isEdit ? (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? "Deleting..." : "Delete"}
            </button>
          ) : (
            <div />
          )}

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-gray-600 border border-gray-200 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : isEdit ? "Save changes" : "Add event"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
