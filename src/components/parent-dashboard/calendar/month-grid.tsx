"use client";

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  format,
} from "date-fns";

export interface CalendarEventData {
  id: string;
  title: string;
  startAt: string; // ISO
  endAt: string | null;
  isDreampaths: boolean;
  childId: string | null;
  packId: string | null;
  missionId: string | null;
  description: string | null;
  emailReminder: boolean;
}

export interface EtaMilestone {
  childName: string;
  packTitle: string;
  date: Date;
}

interface MonthGridProps {
  month: Date; // any date in the target month
  events: CalendarEventData[];
  milestones: EtaMilestone[];
  onDayClick: (date: Date) => void;
  onEventClick: (event: CalendarEventData) => void;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function MonthGrid({ month, events, milestones, onDayClick, onEventClick }: MonthGridProps) {
  const start = startOfWeek(startOfMonth(month));
  const end = endOfWeek(endOfMonth(month));
  const days = eachDayOfInterval({ start, end });

  function getEventsForDay(day: Date) {
    return events.filter((e) => isSameDay(new Date(e.startAt), day));
  }

  function getMilestonesForDay(day: Date) {
    return milestones.filter((m) => isSameDay(m.date, day));
  }

  return (
    <div className="w-full">
      {/* Day-of-week header */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-xs font-semibold text-gray-400 text-center py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar cells */}
      <div className="grid grid-cols-7 gap-px bg-gray-100 border border-gray-100 rounded-xl overflow-hidden">
        {days.map((day) => {
          const inMonth = isSameMonth(day, month);
          const dayEvents = getEventsForDay(day);
          const dayMilestones = getMilestonesForDay(day);
          const isToday = isSameDay(day, new Date());

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDayClick(day)}
              className={`
                min-h-[80px] p-1.5 text-left flex flex-col gap-0.5 transition-colors
                ${inMonth ? "bg-white hover:bg-violet-50" : "bg-gray-50 hover:bg-gray-100"}
              `}
            >
              <span
                className={`
                  text-xs font-medium w-5 h-5 flex items-center justify-center rounded-full shrink-0
                  ${isToday ? "bg-violet-600 text-white" : inMonth ? "text-gray-700" : "text-gray-300"}
                `}
              >
                {format(day, "d")}
              </span>

              {dayEvents.map((ev) => (
                <span
                  key={ev.id}
                  onClick={(e) => { e.stopPropagation(); onEventClick(ev); }}
                  className={`
                    block text-[10px] leading-tight px-1 py-0.5 rounded truncate w-full cursor-pointer
                    ${ev.isDreampaths
                      ? "bg-violet-100 text-violet-700 hover:bg-violet-200"
                      : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                    }
                  `}
                >
                  {ev.title}
                </span>
              ))}

              {dayMilestones.map((m, i) => (
                <span
                  key={i}
                  title={`${m.childName} projected to finish ${m.packTitle}`}
                  className="block text-[10px] leading-tight px-1 py-0.5 rounded truncate w-full bg-green-100 text-green-700"
                >
                  ~Finish: {m.childName}
                </span>
              ))}
            </button>
          );
        })}
      </div>
    </div>
  );
}
