"use client";

import { GoogleMapsProvider } from "./google-maps-provider";
import { PahunaMap } from "./pahuna-map";
import { PahunaMarker } from "./pahuna-marker";
import { PahunaInfoCard } from "./pahuna-info-card";
import { PahunaDirections } from "./pahuna-directions";
import { ZOOM, type MarkerCategory } from "./map-constants";

export interface NearbyMapPlace {
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  category: MarkerCategory;
  coverImage?: string;
  subtitle?: string;
  href: string;
}

interface HotelDetailMapProps {
  lat: number;
  lng: number;
  name: string;
  address?: string;
  nearbyPlaces?: NearbyMapPlace[];
}

/**
 * Hotel detail page map with the hotel marker highlighted
 * and optional nearby attractions / experiences shown.
 */
export function HotelDetailMap({
  lat,
  lng,
  name,
  address,
  nearbyPlaces = [],
}: HotelDetailMapProps) {
  const position = { lat, lng };
  const zoom = nearbyPlaces.length > 0 ? ZOOM.area : ZOOM.detail;

  return (
    <GoogleMapsProvider>
      <div className="space-y-3">
        <PahunaMap
          center={position}
          zoom={zoom}
          className="w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden"
          fallbackLabel={address ?? name}
        >
          {/* Hotel — primary marker */}
          <PahunaMarker
            position={position}
            title={name}
            category="hotel"
            isActive
          >
            <div className="p-2">
              <p className="font-semibold text-sm">{name}</p>
              {address && (
                <p className="text-xs text-slate-500">{address}</p>
              )}
            </div>
          </PahunaMarker>

          {/* Nearby places */}
          {nearbyPlaces.map((place) => (
            <PahunaMarker
              key={place.slug}
              position={{ lat: place.latitude, lng: place.longitude }}
              title={place.name}
              category={place.category}
            >
              <PahunaInfoCard
                name={place.name}
                href={place.href}
                image={place.coverImage}
                subtitle={place.subtitle}
                category={place.category}
              />
            </PahunaMarker>
          ))}
        </PahunaMap>

        <div className="flex items-center justify-between">
          <PahunaDirections lat={lat} lng={lng} />
          {nearbyPlaces.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {nearbyPlaces.length} nearby{" "}
              {nearbyPlaces.length === 1 ? "place" : "places"} shown
            </p>
          )}
        </div>
      </div>
    </GoogleMapsProvider>
  );
}


