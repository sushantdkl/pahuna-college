// @ts-nocheck
"use client";

import { Marker, Popup } from "react-leaflet";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Marker as LeafletMarker } from "leaflet";
import L from "leaflet";
import { type MarkerCategory } from "./map-constants";

interface PahunaMarkerProps {
  position: { lat: number; lng: number };
  title: string;
  /** Category determines the pin color and icon */
  category?: MarkerCategory;
  /** Optional numbered label (e.g. day number on route maps) */
  label?: string | number;
  /** Optional info window content */
  children?: React.ReactNode;
  /** Controlled info-window open state (omit for uncontrolled) */
  isOpen?: boolean;
  /** Callback when info-window open state changes (controlled mode) */
  onOpenChange?: (open: boolean) => void;
  /** Visual highlight — scales up the pin with a glow ring */
  isActive?: boolean;
}

/**
 * Branded Pahuna map marker with category-specific color and icon.
 * Supports controlled or uncontrolled info window, numbered label, and active highlight.
 */
export function PahunaMarker({
  position,
  title,
  category = "default",
  label,
  children,
  isOpen: controlledOpen,
  onOpenChange,
  isActive,
}: PahunaMarkerProps) {
  const markerRef = useRef<LeafletMarker | null>(null);
  const [internalOpen, setInternalOpen] = useState(false);

  // Controlled vs uncontrolled info window
  const isInfoOpen =
    controlledOpen !== undefined ? controlledOpen : internalOpen;

  const setOpen = (open: boolean) => {
    if (onOpenChange) onOpenChange(open);
    else setInternalOpen(open);
  };

  const positionArray: [number, number] = [position.lat, position.lng];

  const markerColorByCategory: Record<MarkerCategory, string> = {
    destination: "#166534", // primary green
    lake: "#0369a1", // blue
    temple: "#b45309", // amber
    experience: "#7c3aed", // purple
    hotel: "#be185d", // pink
    restaurant: "#be185d",
    itinerary: "#166534",
    office: "#14532d",
    default: "#166534",
  };

  const pinColor = markerColorByCategory[category] ?? "#166534";

  const iconHtml = useMemo(() => {
    const labelHtml =
      label != null
        ? `<span style="position:absolute;top:-6px;right:-6px;display:flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:999px;background:#ffffff;color:#111827;font-size:10px;font-weight:700;box-shadow:0_1px_4px_rgba(0,0,0,0.3);">${label}</span>`
        : "";

    const scale = isActive ? 1.1 : 1;

    return `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;transform:scale(${scale});transition:transform 150ms ease-out;">
        <div style="width:32px;height:32px;background:${pinColor};border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #ffffff;box-shadow:0 2px 8px rgba(0,0,0,0.25);"></div>
        ${labelHtml}
      </div>
    `;
  }, [pinColor, isActive, label]);

  const icon = useMemo(
    () =>
      L.divIcon({
        html: iconHtml,
        className: "pahuna-marker", // avoid default Leaflet icon styles
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -36],
      }),
    [iconHtml],
  );

  useEffect(() => {
    const m = markerRef.current;
    if (!m) return;
    if (isInfoOpen) m.openPopup();
    else m.closePopup();
  }, [isInfoOpen]);

  return (
    <Marker
      ref={markerRef as unknown as React.Ref<LeafletMarker>}
      position={positionArray}
      icon={icon}
      title={title}
      eventHandlers={{
        click: () => setOpen(!isInfoOpen),
        popupclose: () => setOpen(false),
      }}
    >
      {children && (
        <Popup>
          {children}
        </Popup>
      )}
    </Marker>
  );
}


