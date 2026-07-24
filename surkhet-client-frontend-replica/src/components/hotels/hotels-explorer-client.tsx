"use client";

import dynamic from "next/dynamic";

export const HotelsExplorerClient = dynamic(
  () =>
    import("./hotels-explorer").then(
      (m) => m.HotelsExplorer,
    ),
  { ssr: false },
);


