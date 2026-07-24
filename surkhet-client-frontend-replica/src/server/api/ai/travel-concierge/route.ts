import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    summary: "A practical Surkhet and Karnali travel plan.",
    itinerary: [{ day: 1, title: "Explore Surkhet", description: "Visit Bulbule Lake, Kakrebihar, and local cafes." }],
    confidence: 86,
    tips: ["Confirm routes before travel", "Keep buffer time for Karnali journeys"],
  });
}
