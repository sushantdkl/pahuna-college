import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Column<T> = {
  header: string;
  accessorKey: keyof T;
  cell?: (value: T[keyof T], row: T) => ReactNode;
  className?: string;
};

type DataTableCardProps<T> = {
  title: string;
  description?: string;
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
};

export function DataTableCard<T extends { id: string }>({
  title,
  description,
  columns,
  data,
  emptyMessage = "No data yet",
}: DataTableCardProps<T>) {
  return (
    <ReplicaDataCard title={title} description={description} count={data.length}>
      {data.length === 0 ? (
        <p className="py-6 text-center text-sm text-stone-500">{emptyMessage}</p>
      ) : (
        <table className="w-full text-sm" aria-label={title}>
          <thead>
            <tr className="border-b text-left">
              {columns.map((col) => (
                <th key={String(col.accessorKey)} className={cn("pb-2 pr-4 font-medium text-stone-500", col.className)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-b last:border-0">
                {columns.map((col) => (
                  <td key={String(col.accessorKey)} className={cn("py-2.5 pr-4", col.className)}>
                    {col.cell ? col.cell(row[col.accessorKey], row) : String(row[col.accessorKey] ?? "-")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </ReplicaDataCard>
  );
}

export function ReplicaDataCard({ title, description, count, children }: { title: string; description?: string; count?: number; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-stone-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          {description ? <p className="text-sm text-stone-500">{description}</p> : null}
        </div>
        {typeof count === "number" ? <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">{count}</span> : null}
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">{children}</div>
      </div>
    </section>
  );
}

export function StatusBadge({
  status,
  map,
}: {
  status: string;
  map?: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }>;
}) {
  const defaultMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    NEW: { label: "New", variant: "default" },
    PENDING: { label: "Pending", variant: "secondary" },
    CONTACTED: { label: "Contacted", variant: "outline" },
    CONFIRMED: { label: "Confirmed", variant: "default" },
    UNDER_REVIEW: { label: "Under Review", variant: "secondary" },
    APPROVED: { label: "Approved", variant: "default" },
    REJECTED: { label: "Rejected", variant: "destructive" },
    QUALIFIED: { label: "Qualified", variant: "default" },
    COMPLETED: { label: "Completed", variant: "default" },
    CANCELLED: { label: "Cancelled", variant: "destructive" },
    WON: { label: "Won", variant: "default" },
    LOST: { label: "Lost", variant: "destructive" },
  };
  const resolved = (map ?? defaultMap)[status] ?? { label: status, variant: "outline" as const };

  return <ReplicaStatusBadge>{resolved.label}</ReplicaStatusBadge>;
}

export function ReplicaStatusBadge({
  children,
  tone = "success",
}: {
  children: ReactNode;
  tone?: "success" | "warning" | "danger" | "neutral";
}) {
  const toneClassName = {
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-red-50 text-red-700",
    neutral: "bg-stone-100 text-stone-700",
  }[tone];

  return <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", toneClassName)}>{children}</span>;
}
