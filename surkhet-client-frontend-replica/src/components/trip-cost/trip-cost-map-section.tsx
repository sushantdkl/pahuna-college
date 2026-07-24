"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Hotel,
  Compass,
  Mountain,
  Navigation,
  DollarSign,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GoogleMapsProvider } from "@/components/maps/google-maps-provider";
import { PahunaMap } from "@/components/maps/pahuna-map";
import { PahunaMarker } from "@/components/maps/pahuna-marker";
import { PahunaInfoCard } from "@/components/maps/pahuna-info-card";
import { SURKHET_CENTER, ZOOM, type MarkerCategory } from "@/components/maps/map-constants";
import { distanceKm } from "@server/lib/geo-utils";

interface CostPlace {
  name: string;
  slug: string;
  latitude?: number;
  longitude?: number;
  coverImage?: string;
  category: MarkerCategory;
  costHint?: string;
  subtitle?: string;
  href: string;
}

interface TripCostMapSectionProps {
  hotels: CostPlace[];
  destinations: CostPlace[];
  experiences: CostPlace[];
}

type CostFilter = "all" | "hotel" | "destination" | "experience";

const COST_FILTERS: { value: CostFilter; label: string; icon: React.ElementType }[] = [
  { value: "all", label: "All", icon: MapPin },
  { value: "hotel", label: "Stays", icon: Hotel },
  { value: "destination", label: "Places", icon: Mountain },
  { value: "experience", label: "Activities", icon: Compass },
];

/**
 * Location-aware map section for Trip Cost page.
 * Shows hotels, destinations, and experiences with cost hints
 * and inter-place distance estimation.
 */
export function TripCostMapSection({
  hotels,
  destinations,
  experiences,
}: TripCostMapSectionProps) {
  const [filter, setFilter] = useState<CostFilter>("all");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const allPlaces = [...hotels, ...destinations, ...experiences];
  const filteredPlaces =
    filter === "all"
      ? allPlaces
      : allPlaces.filter((p) => {
          if (filter === "hotel") return p.category === "hotel";
          if (filter === "destination")
            return ["destination", "lake", "temple"].includes(p.category);
          return p.category === "experience";
        });

  const mappable = filteredPlaces.filter((p) => p.latitude && p.longitude);
  const selectedPlace = selectedSlug
    ? allPlaces.find((p) => p.slug === selectedSlug)
    : null;

  // Calculate distances from selected place to nearby places
  const nearbyDistances =
    selectedPlace?.latitude && selectedPlace?.longitude
      ? allPlaces
          .filter(
            (p) =>
              p.slug !== selectedSlug &&
              p.latitude &&
              p.longitude,
          )
          .map((p) => ({
            name: p.name,
            category: p.category,
            distance: distanceKm(
              selectedPlace.latitude!,
              selectedPlace.longitude!,
              p.latitude!,
              p.longitude!,
            ),
          }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 4)
      : [];

  return (
    <div className="space-y-4">
      {/* ── Filter pills ── */}
      <div className="flex flex-wrap items-center gap-2">
        {COST_FILTERS.map(({ value, label, icon: Icon }) => (
          <Badge
            key={value}
            variant={filter === value ? "default" : "outline"}
            className="cursor-pointer px-3 py-1.5 text-sm gap-1.5 transition-colors hover:bg-primary hover:text-primary-foreground"
            onClick={() => {
              setFilter(value);
              setSelectedSlug(null);
            }}
          >
            <Icon className="h-3.5 w-3.5" /> {label}
          </Badge>
        ))}
        <span className="text-xs text-muted-foreground ml-2">
          {mappable.length} places on map
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2">
          <GoogleMapsProvider>
            <PahunaMap
              center={SURKHET_CENTER}
              zoom={ZOOM.city}
              className="w-full h-[350px] md:h-[400px] rounded-xl overflow-hidden"
              fallbackLabel="Trip Cost Map — Surkhet"
            >
              {mappable.map((place) => (
                <PahunaMarker
                  key={place.slug}
                  position={{ lat: place.latitude!, lng: place.longitude! }}
                  title={place.name}
                  category={place.category}
                  isActive={selectedSlug === place.slug}
                  isOpen={selectedSlug === place.slug}
                  onOpenChange={(open) =>
                    setSelectedSlug(open ? place.slug : null)
                  }
                >
                  <PahunaInfoCard
                    name={place.name}
                    href={place.href}
                    image={place.coverImage}
                    subtitle={place.costHint ?? place.subtitle}
                    category={place.category}
                  />
                </PahunaMarker>
              ))}
            </PahunaMap>
          </GoogleMapsProvider>
        </div>

        {/* Cost context panel */}
        <div className="space-y-3">
          <Card className="border-dashed">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="h-4 w-4 text-primary" />
                <h4 className="font-semibold text-sm">Cost by Category</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">🏨 Hotels</span>
                  <span className="font-medium">NPR 1,500 – 8,000/night</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">🏔 Attractions</span>
                  <span className="font-medium">Free – NPR 50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">🧭 Experiences</span>
                  <span className="font-medium">NPR 500 – 2,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">🚌 Transport</span>
                  <span className="font-medium">NPR 500 – 800/trip</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected place context */}
          {selectedPlace ? (
            <Card>
              <CardContent className="p-4">
                <p className="font-semibold text-sm mb-1">
                  {selectedPlace.name}
                </p>
                {selectedPlace.costHint && (
                  <p className="text-xs text-muted-foreground mb-2">
                    💰 {selectedPlace.costHint}
                  </p>
                )}
                {nearbyDistances.length > 0 && (
                  <div className="mt-3 border-t pt-3">
                    <p className="text-xs font-medium mb-2 flex items-center gap-1">
                      <Navigation className="h-3 w-3" /> Distances from here
                    </p>
                    <div className="space-y-1.5">
                      {nearbyDistances.map((nd) => (
                        <div
                          key={nd.name}
                          className="flex justify-between text-xs"
                        >
                          <span className="text-muted-foreground truncate mr-2">
                            {nd.name}
                          </span>
                          <span className="font-medium shrink-0">
                            {nd.distance.toFixed(1)} km
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full mt-3"
                >
                  <Link href={selectedPlace.href}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-4 text-center text-sm text-muted-foreground">
                <MapPin className="h-5 w-5 mx-auto mb-2 text-muted-foreground/50" />
                Tap a place on the map to see cost context and distances
              </CardContent>
            </Card>
          )}

          {/* Quick links */}
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href="/hotels">Browse Hotels</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href="/itineraries">Trip Ideas</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}


