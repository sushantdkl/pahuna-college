// @ts-nocheck
"use client";

import dynamic from "next/dynamic";

export const TripMapPanelClient = dynamic(
  () => import("./trip-map-panel").then((m) => m.TripMapPanel),
  { ssr: false },
);


