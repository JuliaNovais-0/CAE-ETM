import { useState } from "react";
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/**
 * Gráfico de pizza usando Recharts.
 *
 * Props:
 *   data  – [{ label, value, color }]
 *   size  – altura em px (default 200)
 */
export default function PieChart({ data = [], size = 200 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;

  const chartData = data.map((d) => ({
    name: d.label,
    value: d.value,
    color: d.color,
  }));

  const renderLabel = ({ name, percent }) =>
    `${Math.round(percent * 100)}%`;

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0];
    return (
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-800">
        <span className="font-medium text-slate-900 dark:text-white">
          {d.name}
        </span>
        <span className="ml-2 text-slate-500 dark:text-slate-400">
          {d.value} ({Math.round(d.payload.value / total * 100)}%)
        </span>
      </div>
    );
  };

  const renderLegend = ({ payload }) => (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-1.5 text-sm">
          <span
            className="inline-block h-3 w-3 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-slate-700 dark:text-slate-300">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <ResponsiveContainer width="100%" height={size + 40}>
      <RechartsPie>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={size / 2 - 10}
          innerRadius={size / 4}
          paddingAngle={0}
          label={renderLabel}
          labelLine={false}
          stroke="none"
        >
          {chartData.map((d, i) => (
            <Cell key={i} fill={d.color} className="outline-none" />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={renderLegend} />
      </RechartsPie>
    </ResponsiveContainer>
  );
}
