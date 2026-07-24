// @ts-nocheck
import Image from "next/image";
import Link from "next/link";
import { MapPin, Route } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import type { PublicDestination } from "@backend/services/destinations";
import { getImageOrPlaceholder } from "@backend/lib/assets";

interface DestinationHeroProps {
  destination: PublicDestination;
}

export function DestinationHero({ destination }: DestinationHeroProps) {
  const image = getImageOrPlaceholder(destination.gallery[0], "destination");

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-emerald-50/70 via-amber-50/50 to-background py-16 lg:py-20">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-5 flex flex-wrap gap-2">
              <Badge className="bg-primary text-primary-foreground">
                {destination.categoryLabel}
              </Badge>
              <Badge variant="secondary">{destination.difficultyLabel}</Badge>
              <Badge variant="outline" className="bg-background/70">
                {destination.district}
              </Badge>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {destination.name}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {destination.shortDescription}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={`/trip-planner?destination=${destination.slug}`}>
                  <Route className="h-4 w-4" />
                  Add to trip planner
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={`/destinations/district/${destination.districtSlug}`}>
                  <MapPin className="h-4 w-4" />
                  Explore {destination.district}
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border/70 bg-white shadow-xl">
            <Image
              src={image}
              alt={destination.name}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </Container>
    </section>
  );
}


