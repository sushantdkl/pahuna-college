// @ts-nocheck
"use client";

import { Polyline } from "react-leaflet";
import { GoogleMapsProvider } from "./google-maps-provider";
import { PahunaMap } from "./pahuna-map";
import { PahunaMarker } from "./pahuna-marker";
import { PahunaDirections } from "./pahuna-directions";
import { ZOOM } from "./map-constants";

interface TripDay {
  dayNumber: number;
  title: string;
  latitude?: number;
  longitude?: number;
  activities?: string[];
  overnight?: string;
}

interface TripRouteMapProps {
  days: TripDay[];
  selectedDay: number | null;
  onSelectDay: (dayNumber: number | null) => void;
  className?: string;
  showDirections?: boolean;
}

function RoutePolyline({ path }: { path: { lat: number; lng: number }[] }) {
  if (path.length < 2) return null;

  const positions = path.map((p) => [p.lat, p.lng] as [number, number]);

  return (
    <>
      {/* Solid subtle background line */}
      <Polyline
        positions={positions}
        pathOptions={{
          color: "#6366f1",
          weight: 6,
          opacity: 0.15,
        }}
      />
      {/* Dashed foreground route line */}
      <Polyline
        positions={positions}
        pathOptions={{
          color: "#6366f1",
          weight: 3,
          opacity: 0.9,
          dashArray: "8 12",
        }}
      />
    </>
  );
}

/**
 * Interactive trip route map with controlled day selection,
 * dashed route line, numbered stop markers, and directions.
 */
export function TripRouteMap({
  days,
  selectedDay,
  onSelectDay,
  className,
  showDirections = true,
}: TripRouteMapProps) {
  const mappable = days.filter((d) => d.latitude && d.longitude);

  if (mappable.length === 0) return null;

  const path = mappable.map((d) => ({ lat: d.latitude!, lng: d.longitude! }));
  const avgLat =
    mappable.reduce((sum, d) => sum + d.latitude!, 0) / mappable.length;
  const avgLng =
    mappable.reduce((sum, d) => sum + d.longitude!, 0) / mappable.length;

  const selectedDayData = selectedDay
    ? mappable.find((d) => d.dayNumber === selectedDay)
    : null;

  return (
    <GoogleMapsProvider>
      <div className="space-y-3">
        <PahunaMap
          center={{ lat: avgLat, lng: avgLng }}
          zoom={ZOOM.city}
          className={
            className ??
            "w-full h-full min-h-[300px] rounded-xl overflow-hidden"
          }
          fallbackLabel="Trip Route — Surkhet"
        >
          <RoutePolyline path={path} />
          {mappable.map((day) => (
            <PahunaMarker
              key={day.dayNumber}
              position={{ lat: day.latitude!, lng: day.longitude! }}
              title={`Day ${day.dayNumber}: ${day.title}`}
              category="itinerary"
              label={day.dayNumber}
              isActive={selectedDay === day.dayNumber}
              isOpen={selectedDay === day.dayNumber}
              onOpenChange={(open) =>
                onSelectDay(open ? day.dayNumber : null)
              }
            >
              <div className="p-2.5 min-w-[180px] max-w-[240px]">
                <p className="text-[10px] uppercase tracking-wider text-indigo-500 font-semibold">
                  Day {day.dayNumber}
                </p>
                <p className="font-semibold text-sm text-slate-900 mt-0.5">
                  {day.title}
                </p>
                {day.activities && day.activities.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {day.activities.slice(0, 3).map((act) => (
                      <p
                        key={act}
                        className="text-xs text-slate-500 flex items-center gap-1.5"
                      >
                        <span className="h-1 w-1 rounded-full bg-indigo-400 shrink-0" />
                        {act}
                      </p>
                    ))}
                    {day.activities.length > 3 && (
                      <p className="text-xs text-slate-400">
                        +{day.activities.length - 3} more
                      </p>
                    )}
                  </div>
                )}
                {day.overnight && day.overnight !== "N/A" && (
                  <p className="text-xs text-slate-500 mt-2 border-t pt-1.5">
                    🏨 {day.overnight}
                  </p>
                )}
              </div>
            </PahunaMarker>
          ))}
        </PahunaMap>

        {/* Directions + Legend row */}
        {showDirections && (
          <div className="flex items-center justify-between">
            {selectedDayData?.latitude && selectedDayData?.longitude ? (
              <PahunaDirections
                lat={selectedDayData.latitude}
                lng={selectedDayData.longitude}
              />
            ) : (
              <div />
            )}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-0.5 w-4 bg-indigo-500 rounded" />
                Route
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-indigo-500" />
                Stop
              </span>
            </div>
          </div>
        )}
      </div>
    </GoogleMapsProvider>
  );
}


