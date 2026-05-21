"use client";

import { useState } from "react";
import Link from "next/link";
import { Client, ContentPiece, Finance, Meeting } from "@/types/database";
import ContentTab from "./ContentTab";
import FinancesTab from "./FinancesTab";
import MeetingsTab from "./MeetingsTab";

type Tab = "content" | "finances" | "meetings";

export default function ClientDetail({
  client,
  pieces,
  finances,
  meetings,
}: {
  client: Client;
  pieces: ContentPiece[];
  finances: Finance[];
  meetings: Meeting[];
  reports: unknown[];
}) {
  const [tab, setTab] = useState<Tab>("content");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/clients" className="text-text-dim hover:text-text transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: client.color }}>
            {client.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-text">{client.name}</h1>
            {client.company && <p className="text-text-dim text-sm">{client.company}</p>}
          </div>
        </div>
        <div className="ml-auto flex gap-3 text-sm text-text-dim">
          {client.monthly_fee && (
            <span className="bg-surface border border-border px-3 py-1 rounded-full">
              ${client.monthly_fee.toLocaleString("es")}/mes
            </span>
          )}
          {client.billing_day && (
            <span className="bg-surface border border-border px-3 py-1 rounded-full">
              Día de cobro: {client.billing_day}
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-1 border-b border-border">
        {(["content", "finances", "meetings"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t
                ? "border-accent text-accent"
                : "border-transparent text-text-dim hover:text-text"
            }`}
          >
            {t === "content" ? "Piezas" : t === "finances" ? "Finanzas" : "Reuniones"}
          </button>
        ))}
      </div>

      {tab === "content" && <ContentTab clientId={client.id} pieces={pieces} />}
      {tab === "finances" && <FinancesTab clientId={client.id} finances={finances} />}
      {tab === "meetings" && <MeetingsTab clientId={client.id} meetings={meetings} />}
    </div>
  );
}
