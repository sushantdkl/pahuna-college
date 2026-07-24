"use client";

import dynamic from "next/dynamic";

export const ExperiencesMapSectionClient = dynamic(
  () =>
    import("./experiences-map-section").then(
      (m) => m.ExperiencesMapSection,
    ),
  { ssr: false },
);


