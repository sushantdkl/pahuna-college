"use client";

import { type ReactNode, createContext, useContext, useMemo } from "react";

interface MapContextValue {
  /**
   * Historically used to indicate external map API readiness.
   * With Leaflet + OpenStreetMap we always have a ready map
   * as long as the client can load tiles.
   */
  isReady: boolean;
}

const MapContext = createContext<MapContextValue>({ isReady: true });

/** Hook kept for compatibility; currently just exposes readiness. */
export function useMapContext() {
  return useContext(MapContext);
}

interface GoogleMapsProviderProps {
  children: ReactNode;
}

/**
 * Backwards-compatible wrapper around map content.
 * For Leaflet we don't need an external provider, so this
 * simply provides a context value and renders children.
 */
export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const value = useMemo<MapContextValue>(() => ({ isReady: true }), []);

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

/**
 * Kept for compatibility; Leaflet + OpenStreetMap do not
 * require an API key, so this always returns true.
 */
export function hasGoogleMapsKey(): boolean {
  return true;
}


