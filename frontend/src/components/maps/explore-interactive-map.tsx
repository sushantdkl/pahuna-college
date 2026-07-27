// @ts-nocheck
"use client";

import { GoogleMapsProvider } from "./google-maps-provider";
import { PahunaMap } from "./pahuna-map";
import { PahunaMarker } from "./pahuna-marker";
import { PahunaInfoCard } from "./pahuna-info-card";
import { SURKHET_CENTER, ZOOM, type MarkerCategory } from "./map-constants";

interface InteractivePlace {
  name: string;
  slug: string;
  latitude?: number;
  longitude?: number;
  coverImage?: string;
  category?: string;
  subtitle?: string;
  href: string;
}

interface ExploreInteractiveMapProps {
  places: InteractivePlace[];
  selectedSlug: string | null;
  onSelectPlace: (slug: string | null) => void;
  className?: string;
}

/**
 * Interactive multi-category map for the Explore page.
 * Shows destinations and experiences with controlled selection.
 */
export function ExploreInteractiveMap({
  places,
  selectedSlug,
  onSelectPlace,
  className,
}: ExploreInteractiveMapProps) {
  const mappable = places.filter((p) => p.latitude && p.longitude);

  if (mappable.length === 0) return null;

  return (
    <GoogleMapsProvider>
      <PahunaMap
        center={SURKHET_CENTER}
        zoom={ZOOM.city}
        className={
          className ??
          "w-full h-full min-h-[300px] rounded-xl overflow-hidden"
        }
        fallbackLabel="Explore Surkhet Valley"
      >
        {mappable.map((place) => (
          <PahunaMarker
            key={place.slug}
            position={{ lat: place.latitude!, lng: place.longitude! }}
            title={place.name}
            category={(place.category as MarkerCategory) ?? "destination"}
            isActive={selectedSlug === place.slug}
            isOpen={selectedSlug === place.slug}
            onOpenChange={(open) =>
              onSelectPlace(open ? place.slug : null)
            }
          >
            <PahunaInfoCard
              name={place.name}
              href={place.href}
              image={place.coverImage}
              subtitle={place.subtitle}
              category={(place.category as MarkerCategory) ?? "destination"}
            />
          </PahunaMarker>
        ))}
      </PahunaMap>
    </GoogleMapsProvider>
  );
}


