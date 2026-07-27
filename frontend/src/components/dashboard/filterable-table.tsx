// @ts-nocheck
"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (value: T[keyof T], row: T) => React.ReactNode;
  className?: string;
}

interface FilterOption {
  value: string;
  label: string;
}

interface FilterableTableProps<T> {
  title: string;
  description?: string;
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  /** Key to filter on */
  filterKey?: keyof T;
  filterLabel?: string;
  filterOptions?: FilterOption[];
  /** Total count (when data is a subset) */
  totalCount?: number;
}

/**
 * Enhanced data table with optional status/type filter dropdown.
 * Renders a card with a filterable table of rows.
 */
export function FilterableTable<T extends { id: string }>({
  title,
  description,
  columns,
  data,
  emptyMessage = "No data yet",
  filterKey,
  filterLabel = "Filter",
  filterOptions,
  totalCount,
}: FilterableTableProps<T>) {
  const [filter, setFilter] = useState("ALL");

  const filtered = useMemo(() => {
    if (!filterKey || filter === "ALL") return data;
    return data.filter((row) => String(row[filterKey]) === filter);
  }, [data, filter, filterKey]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {filterKey && filterOptions && (
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="h-8 w-[140px] text-xs">
                  <SelectValue placeholder={filterLabel} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL" className="text-xs">
                    All
                  </SelectItem>
                  {filterOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-xs"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Badge variant="secondary" className="text-xs shrink-0">
              {totalCount != null
                ? `${filtered.length} / ${totalCount}`
                : filtered.length}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
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
                {filtered.map((row) => (
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


