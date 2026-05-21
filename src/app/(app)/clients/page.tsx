export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { Client } from "@/types/database";
import Link from "next/link";
import NewClientButton from "./NewClientButton";

const statusLabel: Record<string, string> = {
  active: "Activo",
  inactive: "Inactivo",
  paused: "Pausado",
};

const statusStyle: Record<string, string> = {
  active: "bg-green-500/15 text-green-400",
  inactive: "bg-muted/15 text-muted",
  paused: "bg-yellow-500/15 text-yellow-400",
};

export default async function ClientsPage() {
  let all: Client[] = [];
  try {
    const supabase = await createClient();
    const { data: clients } = await supabase
      .from("clients")
      .select("*")
      .order("name");
    all = clients ?? [];
  } catch {
    all = [];
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Clientes</h1>
          <p className="text-text-dim text-sm mt-1">{all.length} clientes en total</p>
        </div>
        <NewClientButton />
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {all.length === 0 ? (
          <div className="p-12 text-center text-text-dim">No hay clientes aún</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 text-xs text-text-dim font-medium uppercase tracking-wider">Cliente</th>
                <th className="text-left px-4 py-3 text-xs text-text-dim font-medium uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 text-xs text-text-dim font-medium uppercase tracking-wider">Fee mensual</th>
                <th className="text-left px-4 py-3 text-xs text-text-dim font-medium uppercase tracking-wider">Día cobro</th>
                <th className="text-left px-4 py-3 text-xs text-text-dim font-medium uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody>
              {all.map((client) => (
                <tr key={client.id} className="border-b border-border last:border-0 hover:bg-border/40 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/clients/${client.id}`} className="flex items-center gap-3 group">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: client.color ?? "#7B6EFF" }}
                      >
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text group-hover:text-accent transition-colors">
                          {client.name}
                        </p>
                        {client.company && (
                          <p className="text-xs text-text-dim">{client.company}</p>
                        )}
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-dim">{client.email ?? "—"}</td>
                  <td className="px-4 py-3 text-sm text-text">
                    {client.monthly_fee ? `$${client.monthly_fee.toLocaleString("es")}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-dim">
                    {client.billing_day ? `Día ${client.billing_day}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusStyle[client.status]}`}>
                      {statusLabel[client.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
