"use client";

import dynamic from "next/dynamic";

export const ExploreExplorerClient = dynamic(
  () =>
    import("./explore-explorer").then(
      (m) => m.ExploreExplorer,
    ),
  { ssr: false },
);


