"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PerformanceChartProps {
  data: Array<{ name: string; revenue: number }>;
  title: string;
  subtitle: string;
}

export function PerformanceChart({ data, title, subtitle }: PerformanceChartProps) {
  return (
    <div className="rounded-3xl border border-cream bg-white/90 p-6 shadow-sm shadow-black/5">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-black-rich">{title}</h3>
          <p className="text-sm text-black/55">{subtitle}</p>
        </div>
        <div className="rounded-full bg-cream px-3 py-1 text-sm font-medium text-golden">
          Live pulse
        </div>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e28812" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#e28812" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#f1ebdf" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "#7a7a7a" }}
            />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#7a7a7a" }} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#e28812"
              fill="url(#revenueFill)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
