"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Finance } from "@/types/database";
import { useRouter } from "next/navigation";

export default function FinancesTab({ clientId, finances }: { clientId: string; finances: Finance[] }) {
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ type: "income", description: "", amount: "", date: "", paid: false });
  const router = useRouter();
  const supabase = createClient();

  const income = finances.filter((f) => f.type === "income").reduce((s, f) => s + f.amount, 0);
  const expenses = finances.filter((f) => f.type === "expense").reduce((s, f) => s + f.amount, 0);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await supabase.from("finances").insert({
      client_id: clientId,
      type: form.type,
      description: form.description,
      amount: parseFloat(form.amount),
      date: form.date,
      paid: form.paid,
    });
    setSaving(false);
    setShowNew(false);
    router.refresh();
  }

  async function togglePaid(f: Finance) {
    await supabase.from("finances").update({ paid: !f.paid }).eq("id", f.id);
    router.refresh();
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-surface border border-border rounded-xl p-4 text-center">
          <p className="text-xs text-text-dim mb-1">Ingresos</p>
          <p className="text-lg font-bold text-green-400">${income.toLocaleString("es")}</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4 text-center">
          <p className="text-xs text-text-dim mb-1">Gastos</p>
          <p className="text-lg font-bold text-red-400">${expenses.toLocaleString("es")}</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4 text-center">
          <p className="text-xs text-text-dim mb-1">Neto</p>
          <p className={`text-lg font-bold ${income - expenses >= 0 ? "text-text" : "text-red-400"}`}>
            ${(income - expenses).toLocaleString("es")}
          </p>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-accent hover:bg-accent-dim text-white text-sm rounded-lg transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nuevo movimiento
        </button>
      </div>

      {finances.length === 0 ? (
        <p className="text-text-dim text-sm text-center py-12">Sin movimientos financieros</p>
      ) : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs text-text-dim font-medium">Descripción</th>
                <th className="text-left px-4 py-3 text-xs text-text-dim font-medium">Fecha</th>
                <th className="text-right px-4 py-3 text-xs text-text-dim font-medium">Monto</th>
                <th className="text-center px-4 py-3 text-xs text-text-dim font-medium">Pagado</th>
              </tr>
            </thead>
            <tbody>
              {finances.map((f) => (
                <tr key={f.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-sm text-text">{f.description}</td>
                  <td className="px-4 py-3 text-sm text-text-dim">{new Date(f.date).toLocaleDateString("es-ES")}</td>
                  <td className={`px-4 py-3 text-sm text-right font-medium ${f.type === "income" ? "text-green-400" : "text-red-400"}`}>
                    {f.type === "income" ? "+" : "-"}${f.amount.toLocaleString("es")}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => togglePaid(f)}
                      className={`w-5 h-5 rounded border transition-colors ${f.paid ? "bg-green-500 border-green-500" : "border-border hover:border-accent"}`}>
                      {f.paid && (
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-semibold text-text">Nuevo movimiento</h2>
              <button onClick={() => setShowNew(false)} className="text-text-dim hover:text-text">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <form onSubmit={save} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs text-text-dim mb-1">Tipo</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setForm({ ...form, type: "income" })}
                      className={`flex-1 py-2 rounded-lg text-sm transition-colors ${form.type === "income" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "border border-border text-text-dim hover:text-text"}`}>
                      Ingreso
                    </button>
                    <button type="button" onClick={() => setForm({ ...form, type: "expense" })}
                      className={`flex-1 py-2 rounded-lg text-sm transition-colors ${form.type === "expense" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "border border-border text-text-dim hover:text-text"}`}>
                      Gasto
                    </button>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-text-dim mb-1">Descripción *</label>
                  <input required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="block text-xs text-text-dim mb-1">Monto *</label>
                  <input required type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:border-accent" />
                </div>
                <div>
                  <label className="block text-xs text-text-dim mb-1">Fecha *</label>
                  <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm text-text focus:outline-none focus:border-accent" />
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <input type="checkbox" id="paid" checked={form.paid} onChange={(e) => setForm({ ...form, paid: e.target.checked })}
                    className="w-4 h-4 accent-accent" />
                  <label htmlFor="paid" className="text-sm text-text-dim">Marcar como pagado</label>
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
