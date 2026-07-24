"use client";

import { GoogleMapsProvider } from "./google-maps-provider";
import { PahunaMap } from "./pahuna-map";
import { PahunaMarker } from "./pahuna-marker";
import { PahunaInfoCard } from "./pahuna-info-card";
import { SURKHET_CENTER, ZOOM } from "./map-constants";

interface MapDestination {
  name: string;
  slug: string;
  latitude?: number;
  longitude?: number;
  coverImage?: string;
  bestSeason?: string;
}

interface ExploreMapSectionProps {
  destinations: MapDestination[];
}

/**
 * Multi-marker map showing destinations around Surkhet.
 */
export function ExploreMapSection({ destinations }: ExploreMapSectionProps) {
  const mappable = destinations.filter((d) => d.latitude && d.longitude);

  if (mappable.length === 0) return null;

  return (
    <GoogleMapsProvider>
      <PahunaMap
        center={SURKHET_CENTER}
        zoom={ZOOM.city}
        className="w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden"
        fallbackLabel="Explore Surkhet Valley"
      >
        {mappable.map((dest) => (
          <PahunaMarker
            key={dest.slug}
            position={{ lat: dest.latitude!, lng: dest.longitude! }}
            title={dest.name}
            category="destination"
          >
            <PahunaInfoCard
              name={dest.name}
              href={`/explore#${dest.slug}`}
              image={dest.coverImage}
              subtitle={dest.bestSeason ? `Best: ${dest.bestSeason}` : undefined}
              category="destination"
            />
          </PahunaMarker>
        ))}
      </PahunaMap>
    </GoogleMapsProvider>
  );
}


