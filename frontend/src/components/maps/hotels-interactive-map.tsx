// @ts-nocheck
"use client";

import { useMemo, useState } from "react";
import { GoogleMapsProvider } from "./google-maps-provider";
import { PahunaMap } from "./pahuna-map";
import { PahunaMarker } from "./pahuna-marker";
import { PahunaInfoCard } from "./pahuna-info-card";
import { SURKHET_CENTER, ZOOM } from "./map-constants";

interface InteractiveHotel {
  name: string;
  slug: string;
  latitude?: number | null;
  longitude?: number | null;
  images?: string[];
  starRating?: number | null;
  rating?: number | null;
  propertyType?: string;
  typeLabel?: string;
  area?: string | null;
  district?: string | null;
  priceFrom?: number | null;
  priceMin?: number | null;
  currency?: string;
  verificationStatus?: string | null;
}

interface HotelsInteractiveMapProps {
  hotels: InteractiveHotel[];
  selectedSlug: string | null;
  onSelectHotel: (slug: string | null) => void;
  className?: string;
}

type MapFilter = "all" | "stays" | "attractions" | "transport" | "tours";

const MAP_FILTERS: { value: MapFilter; label: string }[] = [
  { value: "stays", label: "Stays" },
  { value: "attractions", label: "Attractions" },
  { value: "transport", label: "Transport" },
  { value: "tours", label: "Tours" },
];

const STAY_TYPES = new Set([
  "HOTEL",
  "RESORT",
  "GUEST_HOUSE",
  "GUESTHOUSE",
  "HOMESTAY",
  "LODGE",
]);

const ATTRACTION_TYPES = new Set(["RAFTING_ADVENTURE", "GUIDE"]);
const TRANSPORT_TYPES = new Set(["TRANSPORT_PROVIDER"]);
const TOUR_TYPES = new Set(["TOUR_OPERATOR"]);

function matchesMapFilter(hotel: InteractiveHotel, filter: MapFilter) {
  if (filter === "all") return true;
  const type = hotel.propertyType ?? "";
  if (filter === "stays") return STAY_TYPES.has(type);
  if (filter === "attractions") return ATTRACTION_TYPES.has(type);
  if (filter === "transport") return TRANSPORT_TYPES.has(type);
  if (filter === "tours") return TOUR_TYPES.has(type);
  return true;
}

/**
 * Interactive hotel map with bidirectional selection.
 * Clicking a marker selects it; selection is controlled externally.
 */
export function HotelsInteractiveMap({
  hotels,
  selectedSlug,
  onSelectHotel,
  className,
}: HotelsInteractiveMapProps) {
  const [mapFilter, setMapFilter] = useState<MapFilter>("all");

  const filteredHotels = useMemo(
    () => hotels.filter((hotel) => matchesMapFilter(hotel, mapFilter)),
    [hotels, mapFilter],
  );

  const mappable = filteredHotels.filter((h) => h.latitude && h.longitude);
  const hasLocationGaps = mappable.length < filteredHotels.length;

  if (mappable.length === 0) {
    return (
      <div className={className ?? "min-h-[300px] rounded-xl border bg-muted/40"}>
        <div className="flex h-full min-h-[300px] items-center justify-center p-6 text-center">
          <div>
            <p className="font-semibold">Map locations pending verification</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Some public listings are pending location verification.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-4 top-4 z-[500] max-w-[280px] rounded-2xl border border-white/70 bg-white/90 p-3 shadow-lg backdrop-blur">
        <p className="text-sm font-semibold">Explore on map</p>
        <p className="text-xs text-muted-foreground">
          {mappable.length} stays & services around Karnali
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {MAP_FILTERS.map((filter) => {
            const isActive = mapFilter === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                aria-pressed={isActive}
                onClick={() =>
                  setMapFilter((current) =>
                    current === filter.value ? "all" : filter.value,
                  )
                }
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:ring-offset-1 ${
                  isActive
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-emerald-100 bg-emerald-50/80 text-emerald-800 hover:border-emerald-200"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
        {hasLocationGaps && (
          <p className="mt-2 text-[11px] text-muted-foreground">
            Some public listings are pending location verification.
          </p>
        )}
      </div>
      <GoogleMapsProvider>
        <PahunaMap
          center={SURKHET_CENTER}
          zoom={ZOOM.area}
          className={
            className ??
            "w-full h-full min-h-[300px] rounded-xl overflow-hidden"
          }
          fallbackLabel="Stays and services in Karnali"
        >
          {mappable.map((hotel) => (
            <PahunaMarker
              key={hotel.slug}
              position={{ lat: hotel.latitude!, lng: hotel.longitude! }}
              title={hotel.name}
              category="hotel"
              isActive={selectedSlug === hotel.slug}
              isOpen={selectedSlug === hotel.slug}
              onOpenChange={(open) => onSelectHotel(open ? hotel.slug : null)}
            >
              <PahunaInfoCard
                name={hotel.name}
                href={`/hotels/${hotel.slug}`}
                image={hotel.images?.[0]}
                subtitle={hotel.typeLabel ?? hotel.propertyType}
                area={hotel.area}
                district={hotel.district}
                rating={hotel.rating ?? hotel.starRating ?? undefined}
                priceFrom={hotel.priceFrom ?? hotel.priceMin}
                currency={hotel.currency}
                verificationStatus={hotel.verificationStatus}
                category="hotel"
              />
            </PahunaMarker>
          ))}
        </PahunaMap>
      </GoogleMapsProvider>
    </div>
  );
}


