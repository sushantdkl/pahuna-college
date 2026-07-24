// @ts-nocheck
"use client";

import dynamic from "next/dynamic";

export const ItinerariesExplorerClient = dynamic(
  () =>
    import("./itineraries-explorer").then(
      (m) => m.ItinerariesExplorer,
    ),
  { ssr: false },
);


