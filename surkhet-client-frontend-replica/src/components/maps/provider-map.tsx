"use client";

import { useMemo, useState } from "react";
import { AlertCircle, MapPin } from "lucide-react";
import { GoogleMapsProvider } from "./google-maps-provider";
import { PahunaMap } from "./pahuna-map";
import { PahunaMarker } from "./pahuna-marker";
import { SURKHET_CENTER, ZOOM } from "./map-constants";
import { ProviderMapPopup, type ProviderMapPopupProvider } from "./provider-map-popup";
import { cn } from "@server/lib/utils";

export interface MapProvider extends ProviderMapPopupProvider {
  latitude?: number | null;
  longitude?: number | null;
  googleMapLink?: string | null;
}

type MapFilter = "all" | "stays" | "services" | "attractions" | "transport" | "food";

const MAP_FILTERS: { value: MapFilter; label: string }[] = [
  { value: "stays", label: "Stays" },
  { value: "services", label: "Services" },
  { value: "attractions", label: "Attractions" },
  { value: "transport", label: "Transport" },
  { value: "food", label: "Food" },
];

const STAY_TYPES = new Set(["HOTEL", "RESORT", "GUEST_HOUSE", "GUESTHOUSE", "HOMESTAY", "LODGE"]);
const TRANSPORT_TYPES = new Set(["TRANSPORT_PROVIDER"]);
const SERVICE_TYPES = new Set(["TOUR_OPERATOR", "GUIDE", "TRAINING_PROVIDER", "CONSULTING_PROVIDER", "RAFTING_ADVENTURE"]);

export function hasVerifiedCoordinates(provider: Pick<MapProvider, "latitude" | "longitude">) {
  return (
    typeof provider.latitude === "number" &&
    Number.isFinite(provider.latitude) &&
    typeof provider.longitude === "number" &&
    Number.isFinite(provider.longitude)
  );
}

export function hasMapLocation(provider: Pick<MapProvider, "latitude" | "longitude" | "googleMapLink">) {
  return hasVerifiedCoordinates(provider) || Boolean(provider.googleMapLink?.trim());
}

function matchesFilter(provider: MapProvider, filter: MapFilter) {
  if (filter === "all") return true;
  const type = provider.propertyType ?? "";
  if (filter === "stays") return STAY_TYPES.has(type);
  if (filter === "transport") return TRANSPORT_TYPES.has(type);
  if (filter === "services" || filter === "attractions") return SERVICE_TYPES.has(type);
  return false;
}

interface ProviderMapProps {
  providers: MapProvider[];
  selectedSlug: string | null;
  onSelectProvider: (slug: string | null) => void;
  className?: string;
}

export function ProviderMap({
  providers,
  selectedSlug,
  onSelectProvider,
  className,
}: ProviderMapProps) {
  const [mapFilter, setMapFilter] = useState<MapFilter>("all");

  const filteredProviders = useMemo(
    () => providers.filter((provider) => matchesFilter(provider, mapFilter)),
    [providers, mapFilter],
  );
  const mappable = filteredProviders.filter(hasVerifiedCoordinates);
  const pendingCoordinatesCount = filteredProviders.length - mappable.length;

  if (mappable.length === 0) {
    return (
      <div className={cn("flex min-h-[420px] items-center justify-center rounded-3xl bg-amber-50/70 p-6 text-center", className)}>
        <div className="max-w-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <MapPin className="h-7 w-7" />
          </div>
          <p className="font-semibold">Map locations are being verified by Pahuna.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Providers without verified latitude and longitude stay in the listing, but no fake marker is shown.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden rounded-3xl", className)}>
      <div className="absolute left-4 right-4 top-4 z-[500] rounded-2xl border border-white/70 bg-white/90 p-3 shadow-lg backdrop-blur md:left-5 md:right-auto md:max-w-lg">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-base font-semibold">Karnali Map Explorer</p>
            <p className="text-xs text-muted-foreground">
              Explore stays, services, routes, and nearby places.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {MAP_FILTERS.map((filter) => {
              const isActive = mapFilter === filter.value;
              return (
                <button
                  key={filter.value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setMapFilter((current) => (current === filter.value ? "all" : filter.value))}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20",
                    isActive
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-emerald-100 bg-emerald-50/80 text-emerald-900 hover:border-emerald-200",
                  )}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
        {pendingCoordinatesCount > 0 && (
          <p className="mt-2 flex items-start gap-1.5 text-[11px] text-muted-foreground">
            <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
            Some public listings have Google Maps links but are pending map coordinates.
          </p>
        )}
      </div>

      <GoogleMapsProvider>
        <PahunaMap
          center={SURKHET_CENTER}
          zoom={ZOOM.area}
          className="h-full min-h-[520px] w-full overflow-hidden rounded-3xl"
          fallbackLabel="Karnali stay and service map"
        >
          {mappable.map((provider) => (
            <PahunaMarker
              key={provider.slug}
              position={{ lat: provider.latitude!, lng: provider.longitude! }}
              title={provider.name}
              category="hotel"
              isActive={selectedSlug === provider.slug}
              isOpen={selectedSlug === provider.slug}
              onOpenChange={(open) => onSelectProvider(open ? provider.slug : null)}
            >
              <ProviderMapPopup provider={provider} />
            </PahunaMarker>
          ))}
        </PahunaMap>
      </GoogleMapsProvider>
    </div>
  );
}
