"use client";

import { useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { StayCard } from "@/lib/pahuna-content";

const surkhetCenter: [number, number] = [28.6019, 81.6339];

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export function HotelMap({ stays }: { stays: StayCard[] }) {
  const mappedStays = useMemo(
    () =>
      stays.filter(
        (stay) =>
          typeof stay.latitude === "number" &&
          typeof stay.longitude === "number",
      ),
    [stays],
  );
  const center: [number, number] = mappedStays[0]
    ? [mappedStays[0].latitude as number, mappedStays[0].longitude as number]
    : surkhetCenter;

  return (
    <div className="overflow-hidden rounded-[28px] border border-emerald-900/10 bg-white p-3 shadow-lg shadow-emerald-900/5">
      <MapContainer center={center} zoom={mappedStays.length ? 12 : 11} scrollWheelZoom={false} className="h-[320px]">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mappedStays.length ? (
          mappedStays.map((stay) => (
            <Marker key={stay.name} position={[stay.latitude as number, stay.longitude as number]}>
              <Popup>
                <strong>{stay.name}</strong>
                <br />
                {stay.area}, {stay.district}
                {stay.googleMapLink ? (
                  <>
                    <br />
                    <a href={stay.googleMapLink} target="_blank" rel="noreferrer">
                      Open Google Maps
                    </a>
                  </>
                ) : null}
              </Popup>
            </Marker>
          ))
        ) : (
          <Marker position={surkhetCenter}>
            <Popup>
              <strong>Surkhet stay preview</strong>
              <br />
              Exact hotel coordinates are not available yet.
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
