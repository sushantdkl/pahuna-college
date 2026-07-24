// @ts-nocheck
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VIBE_OPTIONS } from "@/lib/engagement-data";
import { unlockPassportBadge } from "@/lib/passport";
import { cn } from "@backend/lib/utils";

interface VibeTripPlannerProps {
  compact?: boolean;
  title?: string;
  subtitle?: string;
  onUseVibe?: (vibe: (typeof VIBE_OPTIONS)[number]) => void;
}

export function VibeTripPlanner({
  compact = false,
  title = "Pick your Karnali vibe",
  subtitle = "Choose a mood and Pahuna will suggest a practical route style.",
  onUseVibe,
}: VibeTripPlannerProps) {
  const [selectedId, setSelectedId] = useState<(typeof VIBE_OPTIONS)[number]["id"]>("family");
  const selected = VIBE_OPTIONS.find((vibe) => vibe.id === selectedId) ?? VIBE_OPTIONS[0];

  const useVibe = () => {
    unlockPassportBadge(selected.badgeId);
    onUseVibe?.(selected);
  };

  return (
    <Card className="rounded-3xl border-emerald-100 bg-white shadow-sm">
      <CardHeader>
        <Badge className="w-fit bg-primary/10 text-primary" variant="secondary">
          <Wand2 className="h-3.5 w-3.5" />
          Travel vibe
        </Badge>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {VIBE_OPTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSelectedId(id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition",
                selectedId === id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-emerald-100 bg-emerald-50/60 text-emerald-900 hover:border-primary/30",
              )}
              aria-pressed={selectedId === id}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border bg-amber-50/70 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold">{selected.label} route idea</h3>
              <p className="mt-1 text-sm text-muted-foreground">{selected.itineraryType}</p>
            </div>
            <Badge variant="outline">{selected.difficulty}</Badge>
          </div>
          <div className={cn("mt-4 grid gap-3", compact ? "sm:grid-cols-2" : "md:grid-cols-3")}>
            <div className="rounded-2xl bg-white p-3">
              <p className="text-xs font-medium text-muted-foreground">Suggested places</p>
              <p className="mt-1 text-sm font-semibold">{selected.destinations.slice(0, 3).join(", ")}</p>
            </div>
            <div className="rounded-2xl bg-white p-3">
              <p className="text-xs font-medium text-muted-foreground">Recommended duration</p>
              <p className="mt-1 text-sm font-semibold">{selected.duration}</p>
            </div>
            <div className="rounded-2xl bg-white p-3">
              <p className="text-xs font-medium text-muted-foreground">Budget tendency</p>
              <p className="mt-1 text-sm font-semibold">{selected.budget}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Button type="button" onClick={useVibe}>
              Use this vibe
            </Button>
            <Button asChild variant="outline">
              <Link href={selected.href}>
                Build itinerary
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

