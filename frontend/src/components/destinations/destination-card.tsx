// @ts-nocheck
import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Mountain, Route } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getImageOrPlaceholder } from "@/lib/assets";
import { AddToTripButton } from "@/components/trip-planner/add-to-trip-button";
import type { PublicDestination } from "@/lib/services/destinations";

interface DestinationCardProps {
  destination: PublicDestination;
  compact?: boolean;
}

export function DestinationCard({ destination, compact = false }: DestinationCardProps) {
  const image = getImageOrPlaceholder(destination.gallery[0], "destination");

  return (
    <article className="group overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-primary/5">
        <Image
          src={image}
          alt={destination.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain p-10 transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Badge className="bg-white/90 text-foreground shadow-sm backdrop-blur">
            {destination.categoryLabel}
          </Badge>
          <Badge variant="secondary" className="bg-primary/90 text-primary-foreground">
            {destination.difficultyLabel}
          </Badge>
        </div>
      </div>

      <div className={compact ? "p-5" : "p-6"}>
        <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <Link
            href={`/destinations/district/${destination.districtSlug}`}
            className="hover:text-primary"
          >
            {destination.district}
          </Link>
        </div>

        <h3 className="text-xl font-semibold tracking-tight text-foreground">
          <Link href={`/destinations/${destination.slug}`} className="hover:text-primary">
            {destination.name}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {destination.shortDescription}
        </p>

        <div className="mt-5 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>{destination.recommendedDuration ?? "Confirm locally"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mountain className="h-4 w-4 text-primary" />
            <span>{destination.requiresGuide ? "Guide recommended" : "Self-guided possible"}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <AddToTripButton listKey="selectedDestinations" itemId={destination.slug} label={destination.name} />
          <Button asChild size="sm">
            <Link href={`/destinations/${destination.slug}`}>View guide</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/trip-planner?destination=${destination.slug}`}>
              <Route className="h-4 w-4" />
              Build route
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}


