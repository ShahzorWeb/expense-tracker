"use client";

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface ChartDataItem {
  name: string;
  value: number;
}

interface InsightsChartProps {
  data: ChartDataItem[];
}

const COLORS = [
  "#34d399",
  "#10b981",
  "#059669",
  "#6ee7b7",
  "#a7f3d0",
  "#fbbf24",
  "#f87171",
  "#60a5fa",
];

export default function InsightsChart({ data }: InsightsChartProps) {
  if (data.length === 0) {
    return (
      <p className="p-6 text-center text-sm text-neutral-500">
        No expenses this month yet — add some to see your breakdown.
      </p>
    );
  }

  return (
    <div className="flex justify-center">
      <PieChart width={400} height={320}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={110}
          isAnimationActive={false}
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
       <Tooltip
  formatter={(value) => [`Rs ${Number(value).toFixed(0)}`, "Spent"]}
          contentStyle={{
            backgroundColor: "#171717",
            border: "1px solid #404040",
            borderRadius: "8px",
            color: "#fff",
          }}
        />
        <Legend wrapperStyle={{ fontSize: "12px", color: "#a3a3a3" }} />
      </PieChart>
    </div>
  );
}
