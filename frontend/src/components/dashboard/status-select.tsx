// @ts-nocheck
"use client";

import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface StatusOption {
  value: string;
  label: string;
}

interface StatusSelectProps {
  value: string;
  options: StatusOption[];
  onUpdate: (id: string, status: string) => Promise<{ success: boolean }>;
  itemId: string;
  className?: string;
}

/**
 * Inline status dropdown â€” calls a server action on change.
 * Shows pending state while updating.
 */
export function StatusSelect({
  value,
  options,
  onUpdate,
  itemId,
  className,
}: StatusSelectProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      value={value}
      onValueChange={(newStatus) => {
        startTransition(async () => {
          await onUpdate(itemId, newStatus);
        });
      }}
      disabled={isPending}
    >
      <SelectTrigger
        className={cn(
          "h-7 w-[130px] text-xs",
          isPending && "opacity-50",
          className,
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className="text-xs">
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}


