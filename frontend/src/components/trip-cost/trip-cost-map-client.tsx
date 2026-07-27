// @ts-nocheck
"use client";

import { useEffect, useState } from "react";

export function TripCostMapSectionClient(props) {
  const [MapSection, setMapSection] = useState(null);

  useEffect(() => {
    let mounted = true;

    import("./trip-cost-map-section").then((module) => {
      if (mounted) setMapSection(() => module.TripCostMapSection);
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (!MapSection) {
    return (
      <div className="flex h-[350px] items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50/50 text-sm text-muted-foreground md:h-[400px]">
        Loading map...
      </div>
    );
  }

  return <MapSection {...props} />;
}


