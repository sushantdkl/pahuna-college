"use client";

import { Polyline } from "react-leaflet";
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
  totalDays?: number;
  days: Array<{
    dayNumber: number;
    title: string;
    latitude?: number;
    longitude?: number;
  }>;
}

interface ItinerariesInteractiveMapProps {
  itineraries: MapItinerary[];
  selectedSlug: string | null;
  onSelectItinerary: (slug: string | null) => void;
  className?: string;
}

function PreviewPolylines({
  itineraries,
  selectedSlug,
}: {
  itineraries: MapItinerary[];
  selectedSlug: string | null;
}) {
  return (
    <>
      {itineraries.map((itin) => {
        const waypoints = itin.days
          .filter((d) => d.latitude && d.longitude)
          .map((d) => ({ lat: d.latitude!, lng: d.longitude! }));

        if (waypoints.length < 2) return null;

        const positions = waypoints.map((p) => [p.lat, p.lng] as [number, number]);
        const isSelected = itin.slug === selectedSlug;

        return (
          <Polyline
            key={itin.slug}
            positions={positions}
            pathOptions={{
              color: isSelected ? "#6366f1" : "#94a3b8",
              opacity: isSelected ? 0.9 : 0.4,
              weight: isSelected ? 4 : 2,
            }}
          />
        );
      })}
    </>
  );
}

/**
 * Interactive itineraries map with route preview polylines
 * and controlled selection.
 */
export function ItinerariesInteractiveMap({
  itineraries,
  selectedSlug,
  onSelectItinerary,
  className,
}: ItinerariesInteractiveMapProps) {
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
        className={
          className ??
          "w-full h-full min-h-[300px] rounded-xl overflow-hidden"
        }
        fallbackLabel="Trip Ideas — Surkhet"
      >
        <PreviewPolylines
          itineraries={itineraries}
          selectedSlug={selectedSlug}
        />
        {mappable.map((itin) => (
          <PahunaMarker
            key={itin.slug}
            position={{ lat: itin.lat, lng: itin.lng }}
            title={itin.title}
            category="itinerary"
            label={itin.totalDays}
            isActive={selectedSlug === itin.slug}
            isOpen={selectedSlug === itin.slug}
            onOpenChange={(open) =>
              onSelectItinerary(open ? itin.slug : null)
            }
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


