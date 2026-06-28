"use client";

import dynamic from "next/dynamic";
import type { StayCard } from "@/lib/pahuna-content";

const HotelMap = dynamic(
  () => import("@/app/_components/hotel-map").then((mod) => mod.HotelMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[300px] items-center justify-center rounded-[26px] border border-emerald-900/10 bg-white text-sm font-bold text-stone-500">
        Loading map preview...
      </div>
    ),
  },
);

export function StayMapCard({ stay }: { stay: StayCard }) {
  return <HotelMap stays={[stay]} />;
}
