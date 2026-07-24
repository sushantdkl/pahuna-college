"use client";

import { TourismMap } from "@/components/tourism-map";

export function HotelMap({ stays }: { stays?: Array<{ id?: string; _id?: string; name: string; latitude?: number; longitude?: number; address?: string }> }) {
  return (
    <TourismMap
      markers={(stays || [])
        .filter((stay) => typeof stay.latitude === "number" && typeof stay.longitude === "number")
        .map((stay) => ({
          id: stay.id || stay._id || stay.name,
          title: stay.name,
          description: stay.address,
          lat: stay.latitude as number,
          lng: stay.longitude as number,
          category: "hotel",
        }))}
      heightClass="h-[360px]"
    />
  );
}
