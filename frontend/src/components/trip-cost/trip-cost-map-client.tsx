// @ts-nocheck
"use client";

import dynamic from "next/dynamic";

export const TripCostMapSectionClient = dynamic(
  () =>
    import("./trip-cost-map-section").then(
      (m) => m.TripCostMapSection,
    ),
  { ssr: false },
);


