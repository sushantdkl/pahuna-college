import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PublicDestination } from "@server/services/destinations";
import { DestinationCard } from "./destination-card";

interface DistrictDestinationSectionProps {
  district: string;
  destinations: PublicDestination[];
}

export function DistrictDestinationSection({
  district,
  destinations,
}: DistrictDestinationSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-primary">
            {district} destinations
          </p>
          <h2 className="text-3xl font-bold tracking-tight">
            Places to plan carefully
          </h2>
        </div>
        <Button asChild variant="outline">
          <Link href="/trip-planner">
            Plan trip
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {destinations.map((destination) => (
          <DestinationCard
            key={destination.slug}
            destination={destination}
            compact
          />
        ))}
      </div>
    </section>
  );
}


