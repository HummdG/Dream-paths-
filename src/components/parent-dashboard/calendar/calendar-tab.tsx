"use client";

import { useState, useEffect, useCallback } from "react";
import { format, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { MonthGrid } from "./month-grid";
import { EventModal } from "./event-modal";
import { estimateCompletionDate } from "@/lib/calendar-utils";
import type { CalendarEventData, EtaMilestone } from "./month-grid";
import type { ChildData } from "@/components/parent-dashboard/child-progress-card";

interface CalendarTabProps {
  childrenData: ChildData[];
}

export function CalendarTab({ childrenData }: CalendarTabProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [events, setEvents] = useState<CalendarEventData[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEventData | null>(null);
  const [clickedDate, setClickedDate] = useState<Date | null>(null);

  const fetchEvents = useCallback(async (month: Date) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/parent/calendar?year=${month.getFullYear()}&month=${month.getMonth() + 1}`
      );
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents(currentMonth);
  }, [currentMonth, fetchEvents]);

  // Compute ETA milestones for all children
  const milestones: EtaMilestone[] = childrenData.flatMap((child) =>
    child.packs.flatMap((pack) => {
      const allSteps = pack.missions.flatMap((m) => m.steps);
      const eta = estimateCompletionDate(allSteps, new Date());
      if (!eta) return [];
      return [{ childName: child.firstName, packTitle: pack.packTitle, date: eta }];
    })
  );

  function openAddModal(date: Date) {
    setEditingEvent(null);
    setClickedDate(date);
    setModalOpen(true);
  }

  function openEditModal(event: CalendarEventData) {
    setEditingEvent(event);
    setClickedDate(null);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingEvent(null);
    setClickedDate(null);
  }

  function handleSaved() {
    closeModal();
    fetchEvents(currentMonth);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h2 className="text-base font-bold text-gray-800 w-36 text-center">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <button
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => openAddModal(new Date())}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-violet-200 inline-block" />
          DreamPaths session
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-200 inline-block" />
          Personal event
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-green-200 inline-block" />
          Projected finish
        </span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
          Loading...
        </div>
      ) : (
        <MonthGrid
          month={currentMonth}
          events={events}
          milestones={milestones}
          onDayClick={openAddModal}
          onEventClick={openEditModal}
        />
      )}

      {/* Modal */}
      {modalOpen && (
        <EventModal
          event={editingEvent}
          initialDate={clickedDate}
          childrenData={childrenData}
          onClose={closeModal}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
