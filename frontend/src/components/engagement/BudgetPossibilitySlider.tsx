// @ts-nocheck
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CircleDollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BUDGET_OPTIONS } from "@/lib/engagement-data";
import { cn } from "@backend/lib/utils";

interface BudgetPossibilitySliderProps {
  compact?: boolean;
  onBudgetSelect?: (budgetRange: string) => void;
}

export function BudgetPossibilitySlider({
  compact = false,
  onBudgetSelect,
}: BudgetPossibilitySliderProps) {
  const [selectedValue, setSelectedValue] = useState(25000);
  const selected =
    BUDGET_OPTIONS.find((option) => option.value === selectedValue) ?? BUDGET_OPTIONS[1];

  return (
    <Card className="rounded-3xl border-amber-100 bg-[#fbf8f0] shadow-sm">
      <CardHeader>
        <Badge className="w-fit bg-primary/10 text-primary" variant="secondary">
          <CircleDollarSign className="h-3.5 w-3.5" />
          Budget possibilities
        </Badge>
        <CardTitle className="text-2xl">What can you plan with your budget?</CardTitle>
        <p className="text-sm text-muted-foreground">
          These are planning ranges only. Final cost depends on season, transport,
          route condition, stay availability, and group size.
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-2 sm:grid-cols-4">
          {BUDGET_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelectedValue(option.value)}
              className={cn(
                "rounded-2xl border px-3 py-3 text-sm font-semibold transition",
                selectedValue === option.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-white text-muted-foreground hover:border-primary/30",
              )}
              aria-pressed={selectedValue === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border bg-white p-5">
          <p className="text-sm text-muted-foreground">
            With this budget, you may be able to plan...
          </p>
          <h3 className="mt-1 text-xl font-semibold">{selected.title}</h3>
          <ul className={cn("mt-4 grid gap-2 text-sm text-muted-foreground", compact ? "" : "md:grid-cols-3")}>
            {selected.bullets.map((bullet) => (
              <li key={bullet} className="rounded-2xl bg-emerald-50/60 p-3">
                {bullet}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            {selected.chips.map((chip) => (
              <Badge key={chip} variant="secondary">
                {chip}
              </Badge>
            ))}
          </div>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Button type="button" onClick={() => onBudgetSelect?.(selected.ctaBudget)}>
              Plan with this budget
            </Button>
            <Button asChild variant="outline">
              <Link href={`/ai-trip-planner?budget=${encodeURIComponent(selected.ctaBudget)}`}>
                Send inquiry
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <p className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-950">
          Budget suggestions are planning estimates only. Final cost must be confirmed before booking.
        </p>
      </CardContent>
    </Card>
  );
}

