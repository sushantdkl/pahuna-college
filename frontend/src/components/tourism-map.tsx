"use client";

import dynamic from "next/dynamic";

export type TourismMapMarker = {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
  type?: string;
  location?: string;
  price?: string;
  duration?: string;
  href?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  category?: "destination" | "lake" | "temple" | "experience" | "hotel" | "restaurant" | "food" | "stay" | "itinerary" | "office" | "default";
};

export type TourismRouteLine = {
  id: string;
  points: Array<{ lat: number; lng: number }>;
};

type NormalizedTourismMapMarker = {
  id: string;
  title: string;
  description?: string;
  lat: number;
  lng: number;
  category?: "destination" | "lake" | "temple" | "experience" | "hotel" | "restaurant" | "itinerary" | "office" | "default";
};

const Map = dynamic(() => import("@/components/maps/pahuna-map").then((mod) => mod.PahunaMap), {
  ssr: false,
  loading: () => <div className="flex h-80 items-center justify-center rounded-2xl bg-muted text-sm text-muted-foreground">Loading map...</div>,
});

const Marker = dynamic(() => import("@/components/maps/pahuna-marker").then((mod) => mod.PahunaMarker), {
  ssr: false,
});

export function TourismMap({
  markers,
  heightClass = "h-80",
  emptyTitle = "No map points yet",
  emptyDescription,
}: {
  markers: TourismMapMarker[];
  routes?: TourismRouteLine[];
  heightClass?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const normalizedMarkers = markers.reduce<NormalizedTourismMapMarker[]>((items, marker) => {
    const lat = marker.lat ?? marker.latitude;
    const lng = marker.lng ?? marker.longitude;
    if (typeof lat !== "number" || typeof lng !== "number") {
      return items;
    }

    items.push({
      id: marker.id,
      title: marker.title || marker.name || "Pahuna map point",
      description: marker.description || marker.location || marker.type,
      lat,
      lng,
      category: marker.category === "food" ? "restaurant" : marker.category === "stay" ? "hotel" : marker.category,
    });
    return items;
  }, []);

  if (!normalizedMarkers.length) {
    return (
      <div className={`${heightClass} flex items-center justify-center rounded-2xl border bg-muted/50 text-center`}>
        <div>
          <p className="font-semibold">{emptyTitle}</p>
          {emptyDescription ? <p className="mt-1 text-sm text-muted-foreground">{emptyDescription}</p> : null}
        </div>
      </div>
    );
  }

  const first = normalizedMarkers[0];
  return (
    <Map center={{ lat: first.lat, lng: first.lng }} className={`${heightClass} overflow-hidden rounded-2xl border bg-card`}>
      {normalizedMarkers.map((marker) => (
        <Marker key={marker.id} title={marker.title} position={{ lat: marker.lat, lng: marker.lng }} category={marker.category}>
          <div className="max-w-52">
            <p className="font-semibold">{marker.title}</p>
            {marker.description ? <p className="mt-1 text-xs">{marker.description}</p> : null}
          </div>
        </Marker>
      ))}
    </Map>
  );
}
