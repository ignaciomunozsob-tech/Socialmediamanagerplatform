export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { Client, ContentPiece, Finance } from "@/types/database";
import PaymentAlert from "./PaymentAlert";

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <p className="text-text-dim text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold text-text">{value}</p>
      {sub && <p className="text-text-dim text-xs mt-1">{sub}</p>}
    </div>
  );
}

export default async function DashboardPage() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const monthStart = `${year}-${String(month).padStart(2, "0")}-01`;
  const monthEnd = `${year}-${String(month).padStart(2, "0")}-31`;

  let clients: Client[] = [];
  let pieces: ContentPiece[] = [];
  let finances: Finance[] = [];

  try {
    const supabase = await createClient();
    const [clientsRes, piecesRes, financesRes] = await Promise.all([
      supabase.from("clients").select("*").eq("status", "active"),
      supabase
        .from("content_pieces")
        .select("*, client:clients(name,color)")
        .gte("scheduled_date", monthStart)
        .lte("scheduled_date", monthEnd)
        .order("scheduled_date", { ascending: true }),
      supabase
        .from("finances")
        .select("*")
        .gte("date", monthStart)
        .lte("date", monthEnd),
    ]);
    clients = clientsRes.data ?? [];
    pieces = piecesRes.data ?? [];
    finances = financesRes.data ?? [];
  } catch {
    // show empty dashboard if DB not reachable
  }

  const income = finances.filter((f) => f.type === "income").reduce((s, f) => s + f.amount, 0);
  const expenses = finances.filter((f) => f.type === "expense").reduce((s, f) => s + f.amount, 0);
  const pending = pieces.filter((p) => p.status === "pending_approval").length;
  const today = now.getDate();

  const paymentAlerts = clients.filter(
    (c) => c.billing_day !== null && c.billing_day !== undefined && Math.abs((c.billing_day ?? 0) - today) <= 3
  );

  const urgentPieces = pieces
    .filter((p) => p.status !== "published" && p.scheduled_date)
    .filter((p) => {
      const diff = (new Date(p.scheduled_date!).getTime() - now.getTime()) / 86400000;
      return diff >= 0 && diff <= 3;
    })
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Dashboard</h1>
        <p className="text-text-dim text-sm mt-1">
          {now.toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Clientes activos" value={String(clients.length)} />
        <StatCard label="Ingresos del mes" value={`$${income.toLocaleString("es")}`} />
        <StatCard label="Gastos del mes" value={`$${expenses.toLocaleString("es")}`} sub={`Neto: $${(income - expenses).toLocaleString("es")}`} />
        <StatCard label="Piezas pendientes" value={String(pending)} sub="esperando aprobación" />
      </div>

      <PaymentAlert clients={paymentAlerts} today={today} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-xl p-5">
          <h2 className="font-semibold text-text mb-4">Piezas urgentes (próximos 3 días)</h2>
          {urgentPieces.length === 0 ? (
            <p className="text-text-dim text-sm">Sin piezas urgentes</p>
          ) : (
            <div className="space-y-3">
              {urgentPieces.map((p) => {
                const client = p.client as unknown as { name: string; color: string } | undefined;
                const diff = Math.ceil(
                  (new Date(p.scheduled_date!).getTime() - now.getTime()) / 86400000
                );
                return (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: client?.color ?? "#7B6EFF" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text truncate">{p.title}</p>
                      <p className="text-xs text-text-dim">{client?.name}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${diff === 0 ? "bg-red-500/20 text-red-400" : diff === 1 ? "bg-orange-500/20 text-orange-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                      {diff === 0 ? "Hoy" : diff === 1 ? "Mañana" : `${diff}d`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-surface border border-border rounded-xl p-5">
          <h2 className="font-semibold text-text mb-4">Piezas del mes por estado</h2>
          {pieces.length === 0 ? (
            <p className="text-text-dim text-sm">Sin piezas este mes</p>
          ) : (
            <div className="space-y-2">
              {(
                [
                  { status: "draft", label: "Borrador", color: "bg-muted" },
                  { status: "pending_approval", label: "Pendiente aprobación", color: "bg-yellow-500" },
                  { status: "approved", label: "Aprobado", color: "bg-green-500" },
                  { status: "changes_requested", label: "Cambios solicitados", color: "bg-orange-500" },
                  { status: "published", label: "Publicado", color: "bg-accent" },
                ] as const
              ).map(({ status, label, color }) => {
                const count = pieces.filter((p) => p.status === status).length;
                const pct = pieces.length > 0 ? (count / pieces.length) * 100 : 0;
                return (
                  <div key={status}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-text-dim">{label}</span>
                      <span className="text-text">{count}</span>
                    </div>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
