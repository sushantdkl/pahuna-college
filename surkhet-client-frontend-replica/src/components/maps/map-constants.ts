// Pahuna Maps — Constants & Branded Styling

/** Center of Surkhet / Birendranagar */
export const SURKHET_CENTER = { lat: 28.6, lng: 81.6167 };

/** Default zoom levels for different views */
export const ZOOM = {
  city: 13,
  area: 14,
  detail: 16,
} as const;

/** Map provider ID (kept for future custom styling if needed) */
export const MAP_ID = "PAHUNA_MAP";

/**
 * Category types for map markers — each maps to a unique color + icon.
 */
export type MarkerCategory =
  | "hotel"
  | "destination"
  | "experience"
  | "temple"
  | "lake"
  | "restaurant"
  | "itinerary"
  | "office"
  | "default";

/**
 * Category pin colors — Tailwind class names for bg and shadow.
 * Each category gets a distinct color for visual differentiation.
 */
export const CATEGORY_COLORS: Record<
  MarkerCategory,
  { bg: string; shadow: string; text: string }
> = {
  hotel: { bg: "bg-amber-500", shadow: "shadow-amber-500/30", text: "text-white" },
  destination: { bg: "bg-emerald-500", shadow: "shadow-emerald-500/30", text: "text-white" },
  experience: { bg: "bg-violet-500", shadow: "shadow-violet-500/30", text: "text-white" },
  temple: { bg: "bg-orange-500", shadow: "shadow-orange-500/30", text: "text-white" },
  lake: { bg: "bg-sky-500", shadow: "shadow-sky-500/30", text: "text-white" },
  restaurant: { bg: "bg-rose-500", shadow: "shadow-rose-500/30", text: "text-white" },
  itinerary: { bg: "bg-indigo-500", shadow: "shadow-indigo-500/30", text: "text-white" },
  office: { bg: "bg-slate-700", shadow: "shadow-slate-700/30", text: "text-white" },
  default: { bg: "bg-amber-500", shadow: "shadow-amber-500/30", text: "text-white" },
};

// Branded map styling is now provided by the chosen Leaflet tile layer
// (Carto light with OpenStreetMap data), so we no longer need
// provider-specific style definitions here.


