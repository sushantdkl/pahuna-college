"use client";

import dynamic from "next/dynamic";
import type { TourismMapMarker, TourismRouteLine } from "@/app/_components/tourism-map-leaflet";

const LeafletMap = dynamic(
  () => import("@/app/_components/tourism-map-leaflet").then((mod) => mod.TourismMapLeaflet),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-[340px] place-items-center rounded-[8px] border border-emerald-100 bg-white text-sm font-bold text-stone-500">
        <span><span aria-hidden="true">🗺️</span> Loading map preview...</span>
      </div>
    ),
  },
);

export function TourismMap(props: {
  markers: TourismMapMarker[];
  routes?: TourismRouteLine[];
  heightClass?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  return <LeafletMap {...props} />;
}

export type { TourismMapMarker, TourismRouteLine };
