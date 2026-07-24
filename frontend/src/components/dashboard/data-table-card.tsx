// @ts-nocheck
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (value: T[keyof T], row: T) => React.ReactNode;
  className?: string;
}

interface DataTableCardProps<T> {
  title: string;
  description?: string;
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

export function DataTableCard<T extends { id: string }>({
  title,
  description,
  columns,
  data,
  emptyMessage = "No data yet",
}: DataTableCardProps<T>) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <Badge variant="secondary" className="text-xs">
            {data.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label={title}>
              <thead>
                <tr className="border-b text-left">
                  {columns.map((col) => (
                    <th
                      key={String(col.accessorKey)}
                      className={cn(
                        "pb-2 pr-4 font-medium text-muted-foreground",
                        col.className,
                      )}
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id} className="border-b last:border-0">
                    {columns.map((col) => (
                      <td
                        key={String(col.accessorKey)}
                        className={cn("py-2.5 pr-4", col.className)}
                      >
                        {col.cell
                          ? col.cell(row[col.accessorKey], row)
                          : String(row[col.accessorKey] ?? "â€”")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/** Reusable status badge */
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

  const resolved = (map ?? defaultMap)[status] ?? {
    label: status,
    variant: "outline" as const,
  };

  return <Badge variant={resolved.variant}>{resolved.label}</Badge>;
}


