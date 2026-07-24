import {
  CalendarDays,
  Compass,
  Clock,
  MapPinned,
  Mountain,
  Users,
  Wallet,
} from "lucide-react";
import type { PublicDestination } from "@server/services/destinations";

interface DestinationQuickFactsProps {
  destination: PublicDestination;
}

export function DestinationQuickFacts({ destination }: DestinationQuickFactsProps) {
  const facts = [
    {
      label: "District",
      value: destination.district,
      icon: MapPinned,
    },
    {
      label: "Category",
      value: destination.categoryLabel,
      icon: Compass,
    },
    {
      label: "Difficulty",
      value: destination.difficultyLabel,
      icon: Mountain,
    },
    {
      label: "Best season",
      value: destination.bestSeason ?? "Confirm locally",
      icon: CalendarDays,
    },
    {
      label: "Duration",
      value: destination.recommendedDuration ?? "Flexible",
      icon: Clock,
    },
    {
      label: "Family friendly",
      value: destination.familyFriendly ? "Yes" : "Requires caution",
      icon: Users,
    },
    {
      label: "Guide",
      value: destination.requiresGuide ? "Recommended" : "Usually optional",
      icon: Mountain,
    },
    {
      label: "Cost range",
      value: destination.estimatedCostRange ?? "Requires confirmation",
      icon: Wallet,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {facts.map((fact) => {
        const Icon = fact.icon;
        return (
          <div
            key={fact.label}
            className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm"
          >
            <Icon className="mb-3 h-5 w-5 text-primary" />
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {fact.label}
            </p>
            <p className="mt-1 text-sm font-semibold leading-relaxed text-foreground">
              {fact.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}


