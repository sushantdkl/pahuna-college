// @ts-nocheck
"use client";

import dynamic from "next/dynamic";

export const RouteMapSectionClient = dynamic(
  () =>
    import("./route-map-section").then(
      (m) => m.RouteMapSection,
    ),
  { ssr: false },
);


