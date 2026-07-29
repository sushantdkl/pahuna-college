// @ts-nocheck
"use client";

import { useState, useMemo } from "react";
import { Calculator, Minus, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  budgetTiers,
  costBreakdown,
  calculateTripCost,
  type BudgetTier,
} from "@/lib/services";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

const tierColors: Record<BudgetTier, { ring: string; bg: string; text: string }> = {
  budget: { ring: "ring-green-500", bg: "bg-green-50", text: "text-green-700" },
  standard: { ring: "ring-blue-500", bg: "bg-blue-50", text: "text-blue-700" },
  premium: { ring: "ring-amber-500", bg: "bg-amber-50", text: "text-amber-700" },
};

export function BudgetEstimator() {
  const [selectedTier, setSelectedTier] = useState<BudgetTier>("standard");
  const [days, setDays] = useState(3);
  const [travelers, setTravelers] = useState(2);

  const tripTotal = useMemo(() => calculateTripCost(selectedTier, days), [selectedTier, days]);
  const groupTotal = useMemo(
    () => ({ min: tripTotal.min * travelers, max: tripTotal.max * travelers }),
    [tripTotal, travelers]
  );

  const colors = tierColors[selectedTier];

  return (
    <div className="space-y-8">
      {/* -- Tier Selector -- */}
      <div className="grid sm:grid-cols-3 gap-4">
        {budgetTiers.map((tier) => {
          const isActive = selectedTier === tier.id;
          const c = tierColors[tier.id];
          return (
            <button
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className={cn(
                "rounded-xl border-2 p-5 text-left transition-all cursor-pointer",
                isActive
                  ? `${c.bg} ${c.ring} ring-2 border-transparent shadow-md`
                  : "border-border hover:border-primary/30 hover:shadow-sm"
              )}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{tier.emoji}</span>
                <div>
                  <div className="font-semibold text-sm">{tier.label}</div>
                  <div className="text-xs text-muted-foreground">{tier.tagline}</div>
                </div>
              </div>
              <div className={cn("text-lg font-bold", isActive ? c.text : "")}>
                {formatPrice(tier.perDayMin)} - {formatPrice(tier.perDayMax)}
              </div>
              <div className="text-xs text-muted-foreground">per person / day</div>
            </button>
          );
        })}
      </div>

      {/* -- Trip Params -- */}
      <div className="grid sm:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Trip Duration</div>
                <div className="text-xs text-muted-foreground">Number of days</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDays((d) => Math.max(1, d - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-full border hover:bg-muted transition-colors"
                  aria-label="Decrease days"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-2xl font-bold w-8 text-center">{days}</span>
                <button
                  onClick={() => setDays((d) => Math.min(30, d + 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-full border hover:bg-muted transition-colors"
                  aria-label="Increase days"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Travelers</div>
                <div className="text-xs text-muted-foreground">Number of people</div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setTravelers((t) => Math.max(1, t - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-full border hover:bg-muted transition-colors"
                  aria-label="Decrease travelers"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-2xl font-bold w-8 text-center">{travelers}</span>
                <button
                  onClick={() => setTravelers((t) => Math.min(20, t + 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-full border hover:bg-muted transition-colors"
                  aria-label="Increase travelers"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* -- Result Card -- */}
      <Card className={cn(colors.bg, "border-2", colors.ring.replace("ring-", "border-"))}>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="h-5 w-5 text-primary" />
            <span className="font-semibold">Estimated Trip Cost</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Per Person ({days} days)</div>
              <div className={cn("text-2xl font-bold", colors.text)}>
                {formatPrice(tripTotal.min)} - {formatPrice(tripTotal.max)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                Total ({travelers} {travelers === 1 ? "person" : "people"})
              </div>
              <div className={cn("text-2xl font-bold", colors.text)}>
                {formatPrice(groupTotal.min)} - {formatPrice(groupTotal.max)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* -- Detailed Breakdown -- */}
      <div>
        <h3 className="text-xl font-bold mb-4">Cost Breakdown by Category</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {costBreakdown.map((cat) => (
            <Card key={cat.category}>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">{cat.emoji}</span>
                  <h4 className="font-semibold">{cat.category}</h4>
                </div>
                <div className="space-y-3">
                  {cat.items.map((item) => {
                    const range = item[selectedTier];
                    return (
                      <div
                        key={item.name}
                        className="flex items-center justify-between text-sm"
                      >
                        <div>
                          <span className="text-foreground">{item.name}</span>
                          <span className="text-xs text-muted-foreground ml-1">
                            ({item.unit})
                          </span>
                        </div>
                        <span className={cn("font-medium", colors.text)}>
                          {formatPrice(range.min)} - {formatPrice(range.max)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* -- Tier Description -- */}
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <span className="text-3xl">
              {budgetTiers.find((t) => t.id === selectedTier)?.emoji}
            </span>
            <div>
              <h4 className="font-semibold mb-1">
                {budgetTiers.find((t) => t.id === selectedTier)?.label}
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                {budgetTiers.find((t) => t.id === selectedTier)?.description}
              </p>
              <div className="space-y-1">
                {budgetTiers
                  .find((t) => t.id === selectedTier)
                  ?.includes.map((inc) => (
                    <div
                      key={inc}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      {inc}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


