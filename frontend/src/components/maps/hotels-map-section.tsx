// @ts-nocheck
"use client";

import { GoogleMapsProvider } from "./google-maps-provider";
import { PahunaMap } from "./pahuna-map";
import { PahunaMarker } from "./pahuna-marker";
import { PahunaInfoCard } from "./pahuna-info-card";
import { SURKHET_CENTER, ZOOM } from "./map-constants";

interface MapHotel {
  name: string;
  slug: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
  starRating?: number;
  propertyType?: string;
}

interface HotelsMapSectionProps {
  hotels: MapHotel[];
}

/**
 * Multi-marker map showing all hotels in the Surkhet area.
 */
export function HotelsMapSection({ hotels }: HotelsMapSectionProps) {
  const mappableHotels = hotels.filter((h) => h.latitude && h.longitude);

  if (mappableHotels.length === 0) return null;

  return (
    <GoogleMapsProvider>
      <PahunaMap
        center={SURKHET_CENTER}
        zoom={ZOOM.area}
        className="w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden"
        fallbackLabel="Hotels in Surkhet"
      >
        {mappableHotels.map((hotel) => (
          <PahunaMarker
            key={hotel.slug}
            position={{ lat: hotel.latitude!, lng: hotel.longitude! }}
            title={hotel.name}
            category="hotel"
          >
            <PahunaInfoCard
              name={hotel.name}
              href={`/hotels/${hotel.slug}`}
              image={hotel.images?.[0]}
              subtitle={hotel.propertyType}
              rating={hotel.starRating}
              category="hotel"
            />
          </PahunaMarker>
        ))}
      </PahunaMap>
    </GoogleMapsProvider>
  );
}


