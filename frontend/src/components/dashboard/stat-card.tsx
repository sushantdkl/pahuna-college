import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: { value: string; positive: boolean };
  className?: string;
};

export function StatCard({ title, value, subtitle, icon: Icon, trend, className }: StatCardProps) {
  return (
    <div className={cn("rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-stone-500">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-stone-950">{value}</p>
          {subtitle ? <p className="text-xs text-stone-500">{subtitle}</p> : null}
          {trend ? (
            <p className={cn("text-xs font-medium", trend.positive ? "text-emerald-700" : "text-red-700")}>
              {trend.positive ? "Up" : "Down"} {trend.value}
            </p>
          ) : null}
        </div>
        <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
          {Icon ? <Icon className="h-5 w-5" /> : <MetricIcon name={title} />}
        </div>
      </div>
    </div>
  );
}

export function ReplicaStatCard({ title, value, subtitle, icon }: { title: string; value: string | number; subtitle?: string; icon: string }) {
  return <StatCard title={title} value={value} subtitle={subtitle} className={icon ? undefined : undefined} />;
}

function MetricIcon({ name }: { name: string }) {
  const common = "h-5 w-5";
  const props = {
    className: common,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };
  const label = name.toLowerCase();

  if (label.includes("stay") || label.includes("hotel") || label.includes("provider")) {
    return (
      <svg {...props}>
        <path d="M5 20V5a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v15" />
        <path d="M3 20h18" />
        <path d="M9 8h1" />
        <path d="M14 8h1" />
        <path d="M9 12h1" />
        <path d="M14 12h1" />
      </svg>
    );
  }

  if (label.includes("food") || label.includes("menu")) {
    return (
      <svg {...props}>
        <path d="M7 3v8" />
        <path d="M5 3v4a2 2 0 0 0 4 0V3" />
        <path d="M7 11v10" />
        <path d="M16 3v18" />
        <path d="M16 3c2 1 3 3 3 6 0 2-1 4-3 5" />
      </svg>
    );
  }

  if (label.includes("user") || label.includes("admin")) {
    return (
      <svg {...props}>
        <circle cx="12" cy="8" r="3" />
        <path d="M5 20c1-4 13-4 14 0" />
      </svg>
    );
  }

  if (label.includes("pending") || label.includes("review") || label.includes("attention")) {
    return (
      <svg {...props}>
        <path d="M12 8v5" />
        <path d="M12 17h.01" />
        <path d="M10.3 4.3 2.7 18a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0z" />
      </svg>
    );
  }

  if (label.includes("map") || label.includes("location") || label.includes("coordinate")) {
    return (
      <svg {...props}>
        <path d="M12 21s6-5.5 6-11a6 6 0 0 0-12 0c0 5.5 6 11 6 11z" />
        <circle cx="12" cy="10" r="2" />
      </svg>
    );
  }

  if (label.includes("session") || label.includes("safe") || label.includes("route")) {
    return (
      <svg {...props}>
        <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }

  if (label.includes("message") || label.includes("lead")) {
    return (
      <svg {...props}>
        <path d="M5 6h14v10H8l-3 3z" />
      </svg>
    );
  }

  if (label.includes("partner") || label.includes("consulting")) {
    return (
      <svg {...props}>
        <path d="M8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        <path d="M16 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        <path d="M3 20c1-4 9-4 10 0" />
        <path d="M11 20c1-3 7-3 10 0" />
      </svg>
    );
  }

  return (
    <svg {...props}>
      <path d="M4 4h6v6H4z" />
      <path d="M14 4h6v6h-6z" />
      <path d="M4 14h6v6H4z" />
      <path d="M14 14h6v6h-6z" />
    </svg>
  );
}
