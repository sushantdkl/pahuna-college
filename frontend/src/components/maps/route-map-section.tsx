// @ts-nocheck
"use client";

import { Polyline } from "react-leaflet";
import { GoogleMapsProvider } from "./google-maps-provider";
import { PahunaMap } from "./pahuna-map";
import { PahunaMarker } from "./pahuna-marker";
import { SURKHET_CENTER, ZOOM } from "./map-constants";

interface RouteWaypoint {
  dayNumber: number;
  title: string;
  latitude?: number;
  longitude?: number;
}

interface RouteMapSectionProps {
  days: RouteWaypoint[];
  className?: string;
}

/** Inner component that draws a polyline on the map using the Maps JS API */
function RoutePolyline({ path }: { path: { lat: number; lng: number }[] }) {
  if (path.length < 2) return null;

  const positions = path.map((p) => [p.lat, p.lng] as [number, number]);

  return (
    <Polyline
      positions={positions}
      pathOptions={{
        color: "#f59e0b",
        weight: 3,
        opacity: 0.8,
      }}
    />
  );
}

/**
 * Day-by-day route map with numbered waypoints connected by a polyline.
 * Used on itinerary detail and package detail pages.
 */
export function RouteMapSection({ days, className }: RouteMapSectionProps) {
  const mappable = days.filter((d) => d.latitude && d.longitude);

  if (mappable.length < 2) return null;

  const path = mappable.map((d) => ({ lat: d.latitude!, lng: d.longitude! }));

  // Center on the midpoint of all waypoints
  const avgLat = mappable.reduce((sum, d) => sum + d.latitude!, 0) / mappable.length;
  const avgLng = mappable.reduce((sum, d) => sum + d.longitude!, 0) / mappable.length;

  return (
    <GoogleMapsProvider>
      <PahunaMap
        center={{ lat: avgLat, lng: avgLng }}
        zoom={ZOOM.city}
        className={className ?? "w-full h-[280px] md:h-[350px] rounded-xl overflow-hidden"}
        fallbackLabel="Trip Route — Surkhet"
      >
        <RoutePolyline path={path} />

        {/* Numbered day markers */}
        {mappable.map((day) => (
          <PahunaMarker
            key={day.dayNumber}
            position={{ lat: day.latitude!, lng: day.longitude! }}
            title={`Day ${day.dayNumber}: ${day.title}`}
            category="itinerary"
            label={day.dayNumber}
          >
            <div className="p-2 min-w-[160px]">
              <p className="text-xs text-slate-500 font-medium">Day {day.dayNumber}</p>
              <p className="font-semibold text-sm text-slate-900">{day.title}</p>
            </div>
          </PahunaMarker>
        ))}
      </PahunaMap>
    </GoogleMapsProvider>
  );
}


