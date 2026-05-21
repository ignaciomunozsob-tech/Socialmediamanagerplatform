"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartDatum {
  month: string;
  income: number;
  expense: number;
  net: number;
}

export default function FinancesChart({ data }: { data: ChartDatum[] }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <h2 className="font-semibold text-text mb-4">Ingresos vs Gastos (6 meses)</h2>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E1E28" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "#9999AA", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#9999AA", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{ backgroundColor: "#14141A", border: "1px solid #1E1E28", borderRadius: 8, color: "#E8E8F0", fontSize: 12 }}
            formatter={(value) => [`$${Number(value).toLocaleString("es")}`, undefined]}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: "#9999AA" }} />
          <Bar dataKey="income" name="Ingresos" fill="#4ADE80" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" name="Gastos" fill="#F87171" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
