import { demoDestinations, demoExperiences, demoItineraries } from "@server/services";

const API_BASE = (process.env.SERVER_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050").replace(/\/$/, "");
const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || API_BASE).replace(/\/api\/v1$/, "");
const destinationFallbackImage = "/images/surkhet/bulbule-lake.jpg";
const routeFallbackImage = "/images/surkhet_road.jpg";
const serviceFallbackImage = "/images/karnali_bridge.jpg";

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function getApi<T>(path: string) {
  const response = await fetch(`${API_BASE}/api/v1${path}`, {
    cache: "no-store",
  });
  const payload = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !payload.success) {
    throw new Error("API request failed");
  }
  return payload.data;
}

function imageFrom(value: Record<string, any> | null | undefined, fallback: string) {
  const image = value?.images?.[0] || value?.image || value?.coverImage || fallback;
  if (typeof image === "string" && image.startsWith("/uploads/")) {
    return `${API_ORIGIN}${image}`;
  }
  return image;
}

export async function getLiveExperiences() {
  try {
    const records = await getApi<Record<string, any>[]>("/experiences?page=1&limit=50");
    return records.map((experience) => ({
      ...experience,
      id: experience._id || experience.id,
      slug: experience.slug || slugify(experience.name || experience.title || experience._id),
      title: experience.title || experience.name,
      name: experience.name || experience.title,
      coverImage: imageFrom(experience, serviceFallbackImage),
      image: imageFrom(experience, serviceFallbackImage),
      shortDesc: experience.shortDesc || experience.shortDescription || experience.description,
      shortDescription: experience.shortDescription || experience.shortDesc || experience.description,
      difficulty: experience.difficulty || experience.category || "Experience",
      priceRange: experience.priceRange || (typeof experience.price === "number" ? `NPR ${experience.price.toLocaleString("en-IN")}` : "Confirm locally"),
      isFeatured: Boolean(experience.isFeatured || experience.featured),
    }));
  } catch {
    return demoExperiences.map((experience) => ({
      ...experience,
      coverImage: experience.coverImage || experience.image || serviceFallbackImage,
      shortDesc: experience.shortDesc || experience.shortDescription || experience.description,
      difficulty: experience.difficulty || experience.category || "Experience",
      priceRange: experience.priceRange || experience.price || "Confirm locally",
      isFeatured: Boolean(experience.isFeatured || experience.featured),
    }));
  }
}

export async function getLiveDestinations() {
  try {
    const records = await getApi<Record<string, any>[]>("/destinations?page=1&limit=50");
    return records.map((destination) => ({
      ...destination,
      id: destination._id || destination.id,
      slug: destination.slug || slugify(destination.name || destination.title || destination._id),
      title: destination.title || destination.name,
      coverImage: imageFrom(destination, destinationFallbackImage),
      image: imageFrom(destination, destinationFallbackImage),
      bestSeason: destination.bestSeason || destination.bestTimeToVisit || "Confirm locally",
      entryFee: destination.entryFee || "Confirm locally",
    }));
  } catch {
    return demoDestinations;
  }
}

function itinerarySlug(itinerary: Record<string, any>) {
  const id = itinerary._id || itinerary.id || itinerary.slug;
  if (itinerary.slug) return itinerary.slug;
  return `${slugify(itinerary.title || "itinerary")}-${id}`;
}

function itineraryDays(itinerary: Record<string, any>) {
  const destination = itinerary.destinationId && typeof itinerary.destinationId === "object" ? itinerary.destinationId : null;
  const experiences = Array.isArray(itinerary.experienceIds) ? itinerary.experienceIds : [];
  const hotels = Array.isArray(itinerary.hotelIds) ? itinerary.hotelIds : [];
  const stops = [destination, ...experiences, ...hotels].filter(Boolean);

  if (!stops.length) {
    return [{
      dayNumber: 1,
      title: itinerary.title,
      description: itinerary.description,
      activities: ["Confirm route details with Pahuna"],
      meals: "Confirm locally",
      overnight: "Confirm locally",
    }];
  }

  return stops.slice(0, itinerary.totalDays || stops.length).map((stop: Record<string, any>, index: number) => ({
    dayNumber: index + 1,
    title: stop.name || stop.title || `Stop ${index + 1}`,
    description: stop.description || stop.location || stop.district || itinerary.description,
    activities: [stop.category, stop.location, stop.district].filter(Boolean),
    meals: "Confirm locally",
    overnight: stop.address || stop.district || "Confirm locally",
    latitude: stop.latitude,
    longitude: stop.longitude,
  }));
}

export async function getLiveItineraries() {
  try {
    const records = await getApi<Record<string, any>[]>("/itineraries/public?page=1&limit=50");
    return records.map((itinerary) => ({
      ...itinerary,
      slug: itinerarySlug(itinerary),
      shortDesc: itinerary.shortDesc || itinerary.description || "Curated public Pahuna itinerary.",
      duration: itinerary.duration || `${itinerary.totalDays || 1} Days`,
      totalDays: itinerary.totalDays || 1,
      difficulty: itinerary.difficulty || "Moderate",
      estimatedCost: itinerary.estimatedCost || (typeof itinerary.budget === "number" ? `NPR ${itinerary.budget.toLocaleString("en-IN")}` : "Confirm locally"),
      bestSeason: itinerary.bestSeason || "Confirm locally",
      groupSize: itinerary.groupSize || "Custom group",
      coverImage: imageFrom(itinerary.destinationId, routeFallbackImage),
      isFeatured: Boolean(itinerary.isFeatured || itinerary.isPublic),
      days: itinerary.days || itineraryDays(itinerary),
    }));
  } catch {
    return demoItineraries;
  }
}

export async function getLiveItinerary(slug: string) {
  const itineraries = await getLiveItineraries();
  return itineraries.find((itinerary) => itinerary.slug === slug) || null;
}
