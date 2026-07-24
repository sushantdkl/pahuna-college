// @ts-nocheck
"use client";

import dynamic from "next/dynamic";

export const HotelDetailMapClient = dynamic(
  () =>
    import("./hotel-detail-map").then(
      (m) => m.HotelDetailMap,
    ),
  { ssr: false },
);


