"use client";

import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  delta: string;
  detail: string;
  icon: LucideIcon;
  accentClass?: string;
}

export function MetricCard({
  title,
  value,
  delta,
  detail,
  icon: Icon,
  accentClass = "text-golden",
}: MetricCardProps) {
  return (
    <div className="rounded-3xl border border-cream bg-white/90 p-5 shadow-sm shadow-black/5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-black/60">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-black-rich">{value}</p>
        </div>
        <div className={`rounded-2xl bg-cream p-3 ${accentClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="font-semibold text-golden">{delta}</span>
        <span className="text-black/50">{detail}</span>
      </div>
    </div>
  );
}
