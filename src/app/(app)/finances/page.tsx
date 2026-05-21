export const dynamic = "force-dynamic";
import { createClient } from "@/lib/supabase/server";
import { Finance } from "@/types/database";
import FinancesChart from "./FinancesChart";
import FinancesTable from "./FinancesTable";

export default async function FinancesPage() {
  const now = new Date();
  let all: Finance[] = [];

  try {
    const supabase = await createClient();

    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const { data: finances } = await supabase
      .from("finances")
      .select("*, client:clients(name)")
      .gte("date", sixMonthsAgo.toISOString().split("T")[0])
      .order("date", { ascending: false });

    all = finances ?? [];
  } catch {
    all = [];
  }

  const monthlyData: Record<string, { income: number; expense: number }> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthlyData[key] = { income: 0, expense: 0 };
  }

  all.forEach((f) => {
    const key = f.date.slice(0, 7);
    if (monthlyData[key]) {
      if (f.type === "income") monthlyData[key].income += f.amount;
      else monthlyData[key].expense += f.amount;
    }
  });

  const chartData = Object.entries(monthlyData).map(([key, val]) => {
    const [y, m] = key.split("-");
    const label = new Date(parseInt(y), parseInt(m) - 1, 1).toLocaleDateString("es-ES", { month: "short", year: "2-digit" });
    return { month: label, income: val.income, expense: val.expense, net: val.income - val.expense };
  });

  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const currentMonth = all.filter((f) => f.date.startsWith(currentMonthKey));
  const totalIncome = currentMonth.filter((f) => f.type === "income").reduce((s, f) => s + f.amount, 0);
  const totalExpense = currentMonth.filter((f) => f.type === "expense").reduce((s, f) => s + f.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Finanzas</h1>
        <p className="text-text-dim text-sm mt-1">Últimos 6 meses</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface border border-border rounded-xl p-5">
          <p className="text-xs text-text-dim uppercase tracking-wider mb-1">Ingresos este mes</p>
          <p className="text-2xl font-bold text-green-400">${totalIncome.toLocaleString("es")}</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5">
          <p className="text-xs text-text-dim uppercase tracking-wider mb-1">Gastos este mes</p>
          <p className="text-2xl font-bold text-red-400">${totalExpense.toLocaleString("es")}</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5">
          <p className="text-xs text-text-dim uppercase tracking-wider mb-1">Neto este mes</p>
          <p className={`text-2xl font-bold ${totalIncome - totalExpense >= 0 ? "text-text" : "text-red-400"}`}>
            ${(totalIncome - totalExpense).toLocaleString("es")}
          </p>
        </div>
      </div>

      <FinancesChart data={chartData} />
      <FinancesTable finances={all} />
    </div>
  );
}
