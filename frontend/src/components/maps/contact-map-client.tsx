// @ts-nocheck
"use client";

import dynamic from "next/dynamic";

export const ContactMapSectionClient = dynamic(
  () =>
    import("./contact-map-section").then(
      (m) => m.ContactMapSection,
    ),
  { ssr: false },
);


