export type RouteStep = any;
export type RouteOption = any;

export const routeOptions: RouteOption[] = [
  {
    id: "direct-kathmandu-to-surkhet-flight",
    slug: "direct-kathmandu-to-surkhet-flight",
    title: "Kathmandu to Surkhet by Flight",
    route: "Kathmandu - Surkhet",
    from: "Kathmandu",
    to: "Surkhet",
    mode: "FLIGHT",
    duration: "1 hr",
    costMin: 8500,
    costMax: 14500,
    difficulty: "Easy",
    status: "Recommended",
    reliability: "HIGH",
    reliabilityLabel: "Reliable",
    destinationDistrict: "Surkhet",
    featured: true,
    recommendedStopovers: ["Surkhet"],
    riskNotes: ["Flight schedules can shift due to weather."],
    steps: [{ id: "step-flight-skt", title: "Fly to Surkhet", mode: "FLIGHT", duration: "1 hr", costMin: 8500, costMax: 14500, notes: "Direct flight into Surkhet when available." }],
    safetyNotes: ["Confirm flight schedule before travel."],
    image: "/images/hero/surkhet-hero.jpg",
  },
  {
    id: "surkhet-to-rara-road",
    slug: "surkhet-to-rara-road",
    title: "Surkhet to Rara via Kalikot and Jumla",
    route: "Surkhet - Kalikot - Jumla - Rara",
    from: "Surkhet",
    to: "Rara",
    mode: "JEEP",
    duration: "2-3 days",
    costMin: 12000,
    costMax: 28000,
    difficulty: "Moderate",
    status: "Seasonal",
    reliability: "MEDIUM",
    reliabilityLabel: "Seasonal",
    destinationDistrict: "Mugu",
    featured: true,
    recommendedStopovers: ["Kalikot", "Jumla"],
    riskNotes: ["Check road condition and weather.", "Keep buffer days for highland routes."],
    steps: [{ id: "step-rara-road", title: "Road journey", mode: "JEEP", duration: "2-3 days", costMin: 12000, costMax: 28000, notes: "Road route requires local confirmation." }],
    safetyNotes: ["Check road condition and weather."],
    image: "/images/karnali/rara-lake.jpg",
  },
];

export async function getAllRouteOptions() {
  return routeOptions;
}
