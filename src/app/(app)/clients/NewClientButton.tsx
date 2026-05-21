"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const COLORS = ["#7B6EFF", "#FF6B6B", "#4ECDC4", "#FFE66D", "#A8E6CF", "#FF8B94", "#B4A7D6", "#F9A825"];

export default function NewClientButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "active",
    color: COLORS[0],
    billing_day: "",
    monthly_fee: "",
    notes: "",
  });
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await supabase.from("clients").insert({
      name: form.name,
      email: form.email || null,
      phone: form.phone || null,
      company: form.company || null,
      status: form.status,
      color: form.color,
      billing_day: form.billing_day ? parseInt(form.billing_day) : null,
      monthly_fee: form.monthly_fee ? parseFloat(form.monthly_fee) : null,
      notes: form.notes || null,
    });
    setLoading(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-dim text-white text-sm font-medium rounded-lg transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Nuevo cliente
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-semibold text-text">Nuevo cliente</h2>
              <button onClick={() => setOpen(false)} className="text-text-dim hover:text-text">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
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
                  <label className="block text-xs text-text-dim mb-1">Estado</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:border-accent">
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="paused">Pausado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-text-dim mb-1">Fee mensual ($)</label>
                  <input type="number" value={form.monthly_fee} onChange={(e) => setForm({ ...form, monthly_fee: e.target.value })}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="block text-xs text-text-dim mb-1">Día de cobro (1-31)</label>
                  <input type="number" min="1" max="31" value={form.billing_day} onChange={(e) => setForm({ ...form, billing_day: e.target.value })}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:border-accent" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-text-dim mb-2">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {COLORS.map((c) => (
                      <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                        className={`w-7 h-7 rounded-full transition-transform ${form.color === c ? "ring-2 ring-white ring-offset-2 ring-offset-bg scale-110" : "hover:scale-105"}`}
                        style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-text-dim mb-1">Notas</label>
                  <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:border-accent resize-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)}
                  className="flex-1 py-2 border border-border rounded-lg text-sm text-text-dim hover:text-text hover:border-muted transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 py-2 bg-accent hover:bg-accent-dim disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
                  {loading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
