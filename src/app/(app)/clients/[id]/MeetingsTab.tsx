"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Meeting } from "@/types/database";
import { useRouter } from "next/navigation";

export default function MeetingsTab({ clientId, meetings }: { clientId: string; meetings: Meeting[] }) {
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", notes: "", agreements: "" });
  const router = useRouter();
  const supabase = createClient();

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await supabase.from("meetings").insert({
      client_id: clientId,
      title: form.title,
      date: form.date,
      notes: form.notes || null,
      agreements: form.agreements || null,
    });
    setSaving(false);
    setShowNew(false);
    router.refresh();
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-accent hover:bg-accent-dim text-white text-sm rounded-lg transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nueva reunión
        </button>
      </div>

      {meetings.length === 0 ? (
        <p className="text-text-dim text-sm text-center py-12">Sin reuniones registradas</p>
      ) : (
        <div className="space-y-3">
          {meetings.map((m) => (
            <div key={m.id} className="bg-surface border border-border rounded-xl p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-medium text-text">{m.title}</h3>
                <span className="text-xs text-text-dim flex-shrink-0">
                  {new Date(m.date).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </div>
              {m.notes && (
                <div className="mb-3">
                  <p className="text-xs text-text-dim font-medium mb-1">Notas</p>
                  <p className="text-sm text-text whitespace-pre-wrap">{m.notes}</p>
                </div>
              )}
              {m.agreements && (
                <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
                  <p className="text-xs text-accent font-medium mb-1">Acuerdos</p>
                  <p className="text-sm text-text whitespace-pre-wrap">{m.agreements}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-semibold text-text">Nueva reunión</h2>
              <button onClick={() => setShowNew(false)} className="text-text-dim hover:text-text">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <form onSubmit={save} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-text-dim mb-1">Título *</label>
                  <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="block text-xs text-text-dim mb-1">Fecha *</label>
                  <input required type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:border-accent" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-text-dim mb-1">Notas</label>
                  <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:border-accent resize-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-text-dim mb-1">Acuerdos</label>
                  <textarea rows={3} value={form.agreements} onChange={(e) => setForm({ ...form, agreements: e.target.value })}
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
