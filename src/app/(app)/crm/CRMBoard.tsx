"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Lead, LeadStatus } from "@/types/database";
import { useRouter } from "next/navigation";

const COLUMNS: { status: LeadStatus; label: string; color: string }[] = [
  { status: "lead", label: "Lead", color: "#6B6B80" },
  { status: "contacted", label: "Contactado", color: "#7B6EFF" },
  { status: "proposal", label: "Propuesta", color: "#F9A825" },
  { status: "negotiation", label: "Negociación", color: "#FF8B94" },
  { status: "won", label: "Ganado", color: "#4ADE80" },
  { status: "lost", label: "Perdido", color: "#F87171" },
];

export default function CRMBoard({ leads }: { leads: Lead[] }) {
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", status: "lead" as LeadStatus, notes: "", estimated_value: "" });
  const router = useRouter();
  const supabase = createClient();

  async function saveLead(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await supabase.from("leads").insert({
      name: form.name,
      email: form.email || null,
      phone: form.phone || null,
      company: form.company || null,
      status: form.status,
      notes: form.notes || null,
      estimated_value: form.estimated_value ? parseFloat(form.estimated_value) : null,
    });
    setSaving(false);
    setShowNew(false);
    router.refresh();
  }

  async function moveStatus(lead: Lead, status: LeadStatus) {
    await supabase.from("leads").update({ status }).eq("id", lead.id);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-dim text-white text-sm font-medium rounded-lg transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nuevo lead
        </button>
      </div>

      <div className="grid grid-cols-3 xl:grid-cols-6 gap-3">
        {COLUMNS.map((col) => {
          const colLeads = leads.filter((l) => l.status === col.status);
          const total = colLeads.reduce((s, l) => s + (l.estimated_value ?? 0), 0);
          return (
            <div key={col.status} className="bg-surface border border-border rounded-xl p-3 min-h-48">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                  <span className="text-xs font-medium text-text">{col.label}</span>
                </div>
                <span className="text-xs text-text-dim bg-border px-1.5 py-0.5 rounded-full">{colLeads.length}</span>
              </div>
              {total > 0 && (
                <p className="text-xs text-text-dim mb-2">${total.toLocaleString("es")}</p>
              )}
              <div className="space-y-2">
                {colLeads.map((lead) => (
                  <button key={lead.id} onClick={() => setSelectedLead(lead)}
                    className="w-full text-left bg-bg border border-border hover:border-accent/40 rounded-lg p-2.5 transition-colors">
                    <p className="text-xs font-medium text-text truncate">{lead.name}</p>
                    {lead.company && <p className="text-xs text-text-dim truncate">{lead.company}</p>}
                    {lead.estimated_value && (
                      <p className="text-xs font-medium mt-1" style={{ color: col.color }}>
                        ${lead.estimated_value.toLocaleString("es")}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div>
                <h2 className="font-semibold text-text">{selectedLead.name}</h2>
                {selectedLead.company && <p className="text-text-dim text-sm">{selectedLead.company}</p>}
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-text-dim hover:text-text">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {selectedLead.email && <div><span className="text-text-dim">Email: </span><span className="text-text">{selectedLead.email}</span></div>}
                {selectedLead.phone && <div><span className="text-text-dim">Tel: </span><span className="text-text">{selectedLead.phone}</span></div>}
                {selectedLead.estimated_value && <div><span className="text-text-dim">Valor: </span><span className="text-text">${selectedLead.estimated_value.toLocaleString("es")}</span></div>}
              </div>
              {selectedLead.notes && (
                <div>
                  <p className="text-xs text-text-dim font-medium mb-1">Notas</p>
                  <p className="text-sm text-text whitespace-pre-wrap">{selectedLead.notes}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-text-dim font-medium mb-2">Mover a</p>
                <div className="flex flex-wrap gap-2">
                  {COLUMNS.filter((c) => c.status !== selectedLead.status).map((c) => (
                    <button key={c.status} onClick={() => { moveStatus(selectedLead, c.status); setSelectedLead(null); }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:opacity-80"
                      style={{ borderColor: c.color, color: c.color }}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-semibold text-text">Nuevo lead</h2>
              <button onClick={() => setShowNew(false)} className="text-text-dim hover:text-text">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <form onSubmit={saveLead} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs text-text-dim mb-1">Nombre *</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="block text-xs text-text-dim mb-1">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="block text-xs text-text-dim mb-1">Teléfono</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="block text-xs text-text-dim mb-1">Empresa</label>
                  <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="block text-xs text-text-dim mb-1">Valor estimado ($)</label>
                  <input type="number" value={form.estimated_value} onChange={(e) => setForm({ ...form, estimated_value: e.target.value })}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:border-accent" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-text-dim mb-1">Estado</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as LeadStatus })}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:border-accent">
                    {COLUMNS.map((c) => <option key={c.status} value={c.status}>{c.label}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-text-dim mb-1">Notas</label>
                  <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:border-accent resize-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowNew(false)}
                  className="flex-1 py-2 border border-border rounded-lg text-sm text-text-dim hover:text-text transition-colors">Cancelar</button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2 bg-accent hover:bg-accent-dim disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
