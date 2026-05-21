"use client";

import { Client } from "@/types/database";

export default function PaymentAlert({ clients, today }: { clients: Client[]; today: number }) {
  if (clients.length === 0) return null;

  return (
    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <svg className="text-yellow-400 mt-0.5 flex-shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <div>
          <p className="text-yellow-400 font-medium text-sm">Alerta de cobro</p>
          <ul className="mt-1 space-y-0.5">
            {clients.map((c) => {
              const diff = (c.billing_day ?? 0) - today;
              return (
                <li key={c.id} className="text-yellow-300/80 text-sm">
                  <span className="font-medium">{c.name}</span> — día de cobro:{" "}
                  <span className="font-medium">{c.billing_day}</span>
                  {diff === 0 ? " (¡hoy!)" : diff > 0 ? ` (en ${diff} día${diff !== 1 ? "s" : ""})` : ` (hace ${Math.abs(diff)} día${Math.abs(diff) !== 1 ? "s" : ""})`}
                  {c.monthly_fee ? ` · $${c.monthly_fee.toLocaleString("es")}` : ""}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
