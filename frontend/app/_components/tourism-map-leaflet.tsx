"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";

export type TourismMarkerCategory = "stay" | "food" | "destination" | "experience" | "route" | "training" | "consulting";

export type TourismMapMarker = {
  id: string;
  name: string;
  category: TourismMarkerCategory;
  latitude?: number | string | null;
  longitude?: number | string | null;
  type?: string;
  location?: string;
  href?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  price?: string;
  duration?: string;
};

export type TourismRouteLine = {
  id: string;
  label: string;
  mode?: string;
  points: Array<[number | string | null | undefined, number | string | null | undefined]>;
};

type SafeMarker = TourismMapMarker & {
  position: [number, number];
};

const SURKHET_CENTER: [number, number] = [28.6019, 81.6339];
const TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION = "&copy; OpenStreetMap contributors";

const categoryStyles: Record<TourismMarkerCategory, { emoji: string; color: string; label: string }> = {
  stay: { emoji: "\u{1F3E8}", color: "#047857", label: "Stay" },
  food: { emoji: "\u{1F37D}\u{FE0F}", color: "#d97706", label: "Food" },
  destination: { emoji: "\u{1F4CD}", color: "#7c3aed", label: "Destination" },
  experience: { emoji: "\u{1F9ED}", color: "#db2777", label: "Experience" },
  route: { emoji: "\u{1F5FA}\u{FE0F}", color: "#2563eb", label: "Route" },
  training: { emoji: "\u{1F393}", color: "#0891b2", label: "Training" },
  consulting: { emoji: "\u{1F4BC}", color: "#0f766e", label: "Consulting" },
};

function parseCoordinate(value: number | string | null | undefined) {
  const parsed = typeof value === "string" ? Number(value.trim()) : value;
  return typeof parsed === "number" && Number.isFinite(parsed) ? parsed : null;
}

function validPosition(latitude: number | string | null | undefined, longitude: number | string | null | undefined): [number, number] | null {
  const lat = parseCoordinate(latitude);
  const lng = parseCoordinate(longitude);
  if (lat === null || lng === null) return null;
  if (lat === 0 && lng === 0) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return [lat, lng];
}

function iconFor(category: TourismMarkerCategory) {
  const style = categoryStyles[category];
  return L.divIcon({
    className: "pahuna-map-marker",
    html: `<span aria-hidden="true" style="display:grid;place-items:center;width:34px;height:34px;border-radius:999px;background:${style.color};color:white;border:3px solid white;box-shadow:0 10px 25px rgb(0 0 0 / 0.22);font-size:17px">${style.emoji}</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -16],
  });
}

function FitMap({ markers, lines }: { markers: SafeMarker[]; lines: Array<[number, number][]> }) {
  const map = useMap();

  useEffect(() => {
    const points = [
      ...markers.map((marker) => marker.position),
      ...lines.flat(),
    ];

    if (points.length > 1) {
      map.fitBounds(L.latLngBounds(points), { padding: [34, 34], maxZoom: 13 });
      return;
    }

    if (points.length === 1) {
      map.setView(points[0], 13);
      return;
    }

    map.setView(SURKHET_CENTER, 11);
  }, [lines, map, markers]);

  return null;
}

export function TourismMapLeaflet({
  markers,
  routes = [],
  heightClass = "h-[340px]",
  emptyTitle = "Location not available",
  emptyDescription = "No valid latitude and longitude values are available for this map yet.",
}: {
  markers: TourismMapMarker[];
  routes?: TourismRouteLine[];
  heightClass?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const safeMarkers = useMemo<SafeMarker[]>(
    () =>
      markers
        .map((marker) => {
          const position = validPosition(marker.latitude, marker.longitude);
          return position ? { ...marker, position } : null;
        })
        .filter((marker): marker is SafeMarker => Boolean(marker)),
    [markers],
  );

  const safeRoutes = useMemo(
    () =>
      routes
        .map((route) => ({
          ...route,
          positions: route.points.map(([lat, lng]) => validPosition(lat, lng)).filter((point): point is [number, number] => Boolean(point)),
        }))
        .filter((route) => route.positions.length > 1),
    [routes],
  );

  if (!safeMarkers.length && !safeRoutes.length) {
    return (
      <div className={`grid ${heightClass} place-items-center rounded-[8px] border border-emerald-100 bg-emerald-50/45 p-6 text-center`}>
        <div>
          <p className="text-3xl" aria-hidden="true">{"\u{1F5FA}\u{FE0F}"}</p>
          <h3 className="mt-3 text-lg font-black text-stone-950">{emptyTitle}</h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-stone-600">{emptyDescription}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[8px] border border-emerald-100 bg-white p-2 shadow-sm">
      <MapContainer center={safeMarkers[0]?.position || safeRoutes[0]?.positions[0] || SURKHET_CENTER} zoom={12} scrollWheelZoom={false} className={heightClass}>
        <TileLayer attribution={ATTRIBUTION} url={TILE_URL} />
        <FitMap markers={safeMarkers} lines={safeRoutes.map((route) => route.positions)} />
        {safeRoutes.map((route) => (
          <Polyline key={route.id} positions={route.positions} pathOptions={{ color: "#047857", weight: 4, opacity: 0.78 }} />
        ))}
        {safeMarkers.map((marker) => {
          const category = categoryStyles[marker.category];
          return (
            <Marker key={marker.id} position={marker.position} icon={iconFor(marker.category)}>
              <Popup>
                <div className="min-w-44">
                  <strong>{category.emoji} {marker.name}</strong>
                  {marker.type ? <p>{marker.type}</p> : null}
                  {marker.location ? <p>{marker.location}</p> : null}
                  {marker.price ? <p>{"\u{1F4B0}"} {marker.price}</p> : null}
                  {marker.duration ? <p>{"\u{23F1}\u{FE0F}"} {marker.duration}</p> : null}
                  <div className="mt-2 grid gap-1">
                    {marker.href ? <a href={marker.href}>View Details</a> : null}
                    {marker.secondaryHref ? <a href={marker.secondaryHref}>{marker.secondaryLabel || "Build Route"}</a> : null}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      <div className="flex flex-wrap gap-2 px-2 pb-2 pt-3 text-xs font-bold text-stone-600">
        {Array.from(new Set(safeMarkers.map((marker) => marker.category))).map((category) => (
          <span key={category} className="rounded-full bg-emerald-50 px-3 py-1">
            <span aria-hidden="true">{categoryStyles[category].emoji}</span> {categoryStyles[category].label}
          </span>
        ))}
      </div>
    </div>
  );
}
