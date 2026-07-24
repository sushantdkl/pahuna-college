// @ts-nocheck
import Link from "next/link";
import { CalendarRange, CheckCircle2, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PublicDestination } from "@backend/services/destinations";

interface SuggestedItineraryCardProps {
  destination: PublicDestination;
}

export function SuggestedItineraryCard({ destination }: SuggestedItineraryCardProps) {
  const steps = [
    `Start from Surkhet or the nearest district base for ${destination.district}.`,
    `Confirm local access, weather, and stay availability before departure.`,
    destination.requiresGuide
      ? "Use local guide or operator support for route safety."
      : "Plan a flexible visit window and keep buffer time.",
  ];

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-primary/10 p-3 text-primary">
          <CalendarRange className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Suggested itinerary
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight">
            Build a careful {destination.district} plan
          </h2>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {steps.map((step) => (
          <div key={step} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{step}</span>
          </div>
        ))}
      </div>

      <Button asChild className="mt-6">
        <Link href={`/trip-planner?destination=${destination.slug}`}>
          <Route className="h-4 w-4" />
          Build My Karnali Route
        </Link>
      </Button>
    </div>
  );
}


