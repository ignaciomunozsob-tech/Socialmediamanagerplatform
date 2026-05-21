"use client";

import { useState } from "react";
import { Client, ContentPiece, Meeting, Report } from "@/types/database";
import PortalContentTab from "./PortalContentTab";
import PortalCalendarTab from "./PortalCalendarTab";
import PortalReportsTab from "./PortalReportsTab";
import PortalMeetingsTab from "./PortalMeetingsTab";

type Tab = "content" | "calendar" | "reports" | "meetings";

export default function PortalView({
  client,
  pieces,
  meetings,
  reports,
}: {
  client: Client;
  pieces: ContentPiece[];
  meetings: Meeting[];
  reports: Report[];
}) {
  const [tab, setTab] = useState<Tab>("content");

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-surface">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: client.color }}
          >
            {client.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-semibold text-text">{client.name}</h1>
            {client.company && <p className="text-text-dim text-xs">{client.company}</p>}
          </div>
          <div className="ml-auto">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-accent flex items-center justify-center">
                <span className="text-white font-bold text-xs">P</span>
              </div>
              <span className="text-xs text-text-dim">Panel</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex gap-1 border-b border-border mb-6">
          {(
            [
              { key: "content", label: "Contenido" },
              { key: "calendar", label: "Calendario" },
              { key: "reports", label: "Reportes" },
              { key: "meetings", label: "Reuniones" },
            ] as { key: Tab; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === key
                  ? "border-accent text-accent"
                  : "border-transparent text-text-dim hover:text-text"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "content" && <PortalContentTab pieces={pieces} clientId={client.id} />}
        {tab === "calendar" && <PortalCalendarTab pieces={pieces} />}
        {tab === "reports" && <PortalReportsTab reports={reports} />}
        {tab === "meetings" && <PortalMeetingsTab meetings={meetings} />}
      </div>
    </div>
  );
}
