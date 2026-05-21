"use client";

import { useState } from "react";
import { ContentPiece } from "@/types/database";

function getWeekDates(base: Date): Date[] {
  const start = new Date(base);
  const day = start.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diff);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

const statusStyle: Record<string, string> = {
  draft: "#6B6B80",
  pending_approval: "#F9A825",
  approved: "#4ADE80",
  changes_requested: "#FF8B94",
  published: "#7B6EFF",
};

const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export default function PortalCalendarTab({ pieces }: { pieces: ContentPiece[] }) {
  const [weekBase, setWeekBase] = useState(new Date());
  const weekDates = getWeekDates(weekBase);
  const todayStr = new Date().toISOString().split("T")[0];

  function piecesForDay(date: Date) {
    const iso = date.toISOString().split("T")[0];
    return pieces.filter((p) => p.scheduled_date?.split("T")[0] === iso);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => { const d = new Date(weekBase); d.setDate(d.getDate() - 7); setWeekBase(d); }}
          className="p-2 bg-surface border border-border rounded-lg hover:border-accent transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="text-text font-medium min-w-48 text-center text-sm">
          {weekDates[0].toLocaleDateString("es-ES", { month: "long", day: "numeric" })} —{" "}
          {weekDates[6].toLocaleDateString("es-ES", { month: "long", day: "numeric", year: "numeric" })}
        </span>
        <button onClick={() => { const d = new Date(weekBase); d.setDate(d.getDate() + 7); setWeekBase(d); }}
          className="p-2 bg-surface border border-border rounded-lg hover:border-accent transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date, i) => {
          const dayPieces = piecesForDay(date);
          const isToday = date.toISOString().split("T")[0] === todayStr;
          return (
            <div key={i} className={`min-h-32 bg-surface border rounded-xl p-2 ${isToday ? "border-accent" : "border-border"}`}>
              <div className={`text-xs font-medium mb-2 ${isToday ? "text-accent" : "text-text-dim"}`}>
                <div>{dayNames[i]}</div>
                <div className={`text-base font-bold ${isToday ? "text-accent" : "text-text"}`}>{date.getDate()}</div>
              </div>
              <div className="space-y-1">
                {dayPieces.map((p) => (
                  <div
                    key={p.id}
                    className="rounded px-1.5 py-1 text-xs text-white truncate"
                    style={{ backgroundColor: statusStyle[p.status] ?? "#7B6EFF" }}
                    title={p.title}
                  >
                    {p.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
