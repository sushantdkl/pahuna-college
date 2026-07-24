"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HotelActionButtons(props: { hotelName?: string; slug?: string; googleMapLink?: string }) {
  const { hotelName } = props;
  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild><Link href={`/contact?subject=${encodeURIComponent(`Availability request ${hotelName || ""}`)}`}>Ask Availability</Link></Button>
      <Button asChild variant="outline"><Link href="/trip-planner">Plan Trip</Link></Button>
    </div>
  );
}
