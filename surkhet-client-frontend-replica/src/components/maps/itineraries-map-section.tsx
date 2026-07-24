"use client";

import { GoogleMapsProvider } from "./google-maps-provider";
import { PahunaMap } from "./pahuna-map";
import { PahunaMarker } from "./pahuna-marker";
import { PahunaInfoCard } from "./pahuna-info-card";
import { SURKHET_CENTER, ZOOM } from "./map-constants";

interface MapItinerary {
  title: string;
  slug: string;
  coverImage?: string;
  duration?: string;
  days: Array<{ latitude?: number; longitude?: number }>;
}

interface ItinerariesMapSectionProps {
  itineraries: MapItinerary[];
}

/**
 * Multi-marker map for the itineraries listing page.
 * Shows a marker for each itinerary at its first day's location.
 */
export function ItinerariesMapSection({ itineraries }: ItinerariesMapSectionProps) {
  const mappable = itineraries
    .map((itin) => {
      const firstDay = itin.days.find((d) => d.latitude && d.longitude);
      if (!firstDay) return null;
      return { ...itin, lat: firstDay.latitude!, lng: firstDay.longitude! };
    })
    .filter(Boolean) as Array<MapItinerary & { lat: number; lng: number }>;

  if (mappable.length === 0) return null;

  return (
    <GoogleMapsProvider>
      <PahunaMap
        center={SURKHET_CENTER}
        zoom={ZOOM.city}
        className="w-full h-[280px] md:h-[350px] rounded-xl overflow-hidden"
        fallbackLabel="Trip Ideas — Surkhet"
      >
        {mappable.map((itin) => (
          <PahunaMarker
            key={itin.slug}
            position={{ lat: itin.lat, lng: itin.lng }}
            title={itin.title}
            category="itinerary"
          >
            <PahunaInfoCard
              name={itin.title}
              href={`/itineraries/${itin.slug}`}
              image={itin.coverImage}
              subtitle={itin.duration}
              category="itinerary"
            />
          </PahunaMarker>
        ))}
      </PahunaMap>
    </GoogleMapsProvider>
  );
}


