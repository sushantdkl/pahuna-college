"use client";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { type ReactNode, useEffect } from "react";
import { SURKHET_CENTER, ZOOM } from "./map-constants";

interface PahunaMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  children?: ReactNode;
  className?: string;
  fallbackLabel?: string;
}

/**
 * Core branded map component for Pahuna.
 * Uses Leaflet + OpenStreetMap (Carto light tiles) under the hood.
 */
export function PahunaMap({
  center = SURKHET_CENTER,
  zoom = ZOOM.city,
  children,
  className =
    "w-full h-[300px] md:h-[400px] rounded-2xl border border-[#e5e7eb] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.10)] overflow-hidden",
  fallbackLabel = "Pahuna map",
}: PahunaMapProps) {
  const centerArray: [number, number] = [center.lat, center.lng];

  function InvalidateSizeOnMount() {
    const map = useMap();
    useEffect(() => {
      map.invalidateSize();
    }, [map]);
    return null;
  }

  return (
    <div className={className} aria-label={fallbackLabel}>
      <MapContainer
        center={centerArray}
        zoom={zoom}
        scrollWheelZoom
        className="w-full h-full"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
        />
        <InvalidateSizeOnMount />
        {children}
      </MapContainer>
    </div>
  );
}


