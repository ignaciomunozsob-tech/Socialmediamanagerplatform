"use client";

import { useState } from "react";

interface PieceWithClient {
  id: string;
  title: string;
  scheduled_date: string;
  status: string;
  platform: string | null;
  client: { name: string; color: string } | null;
}

const statusLabel: Record<string, string> = {
  draft: "Borrador",
  pending_approval: "Pendiente",
  approved: "Aprobado",
  changes_requested: "Cambios",
  published: "Publicado",
};

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

const dayNames = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

export default function CalendarView({
  pieces,
  clients,
}: {
  pieces: PieceWithClient[];
  clients: { id: string; name: string; color: string }[];
}) {
  const [weekBase, setWeekBase] = useState(new Date());
  const weekDates = getWeekDates(weekBase);

  function prevWeek() {
    const d = new Date(weekBase);
    d.setDate(d.getDate() - 7);
    setWeekBase(d);
  }

  function nextWeek() {
    const d = new Date(weekBase);
    d.setDate(d.getDate() + 7);
    setWeekBase(d);
  }

  function goToday() {
    setWeekBase(new Date());
  }

  function piecesForDay(date: Date) {
    const iso = date.toISOString().split("T")[0];
    return pieces.filter((p) => p.scheduled_date.split("T")[0] === iso);
  }

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={prevWeek} className="p-2 bg-surface border border-border rounded-lg hover:border-accent transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="text-text font-medium min-w-48 text-center">
          {weekDates[0].toLocaleDateString("es-ES", { month: "long", day: "numeric" })} —{" "}
          {weekDates[6].toLocaleDateString("es-ES", { month: "long", day: "numeric", year: "numeric" })}
        </span>
        <button onClick={nextWeek} className="p-2 bg-surface border border-border rounded-lg hover:border-accent transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        <button onClick={goToday} className="ml-2 px-3 py-1.5 text-sm bg-surface border border-border rounded-lg hover:border-accent text-text-dim hover:text-text transition-colors">
          Hoy
        </button>
      </div>

      {clients.length > 0 && (
        <div className="flex gap-3 flex-wrap">
          {clients.map((c) => (
            <div key={c.id} className="flex items-center gap-1.5 text-xs text-text-dim">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
              {c.name}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date, i) => {
          const dayPieces = piecesForDay(date);
          const isToday = date.toISOString().split("T")[0] === todayStr;
          return (
            <div key={i} className={`min-h-36 bg-surface border rounded-xl p-3 ${isToday ? "border-accent" : "border-border"}`}>
              <div className={`text-xs font-medium mb-2 ${isToday ? "text-accent" : "text-text-dim"}`}>
                <div>{dayNames[i]}</div>
                <div className={`text-lg font-bold ${isToday ? "text-accent" : "text-text"}`}>
                  {date.getDate()}
                </div>
              </div>
              <div className="space-y-1">
                {dayPieces.map((p) => (
                  <div
                    key={p.id}
                    className="rounded-md px-2 py-1 text-xs truncate text-white"
                    style={{ backgroundColor: p.client?.color ?? "#7B6EFF" }}
                    title={`${p.title} — ${p.client?.name ?? ""} (${statusLabel[p.status]})`}
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
