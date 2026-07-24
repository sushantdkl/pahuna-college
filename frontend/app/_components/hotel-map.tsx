"use client";

import { TourismMap, type TourismMapMarker } from "@/app/_components/tourism-map";
import type { StayCard } from "@/lib/pahuna-content";

export function HotelMap({ stays }: { stays: StayCard[] }) {
  const markers: TourismMapMarker[] = stays.map((stay) => ({
    id: stay.slug,
    name: stay.name,
    category: "stay",
    latitude: stay.latitude,
    longitude: stay.longitude,
    type: stay.typeLabel || stay.type,
    location: `${stay.area}, ${stay.district}`,
    price: stay.priceFrom,
    href: `/hotels/${stay.slug}`,
  }));

  return (
    <TourismMap
      markers={markers}
      heightClass="h-[320px]"
      emptyTitle="Stay locations not available"
      emptyDescription="Listings without valid coordinates are kept in the results, but exact map markers are shown only after latitude and longitude are available."
    />
  );
}
