import { demoDestinations } from "@server/services";

export type PublicDestination = any;

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");

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

function titleCase(value?: string) {
  if (!value) return "Destination";
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function destinationImage(destination: Record<string, any>) {
  return destination.images?.[0] || destination.image || destination.coverImage || "/images/placeholders/destination-placeholder.svg";
}

function assetUrl(value?: string) {
  if (!value || !value.startsWith("/uploads/")) return value;
  return `${API_BASE.replace(/\/api\/v1$/, "")}${value}`;
}

async function getApi<T>(path: string) {
  const response = await fetch(`${API_BASE}/api/v1${path}`, {
    cache: "no-store",
  });
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !payload.success) {
    throw new Error("Destination API request failed");
  }

  return payload.data;
}

function normalizeDestination(destination: Record<string, any>): PublicDestination {
  const name = destination.name || destination.title || "Karnali destination";
  const slug = destination.slug || slugify(`${name}-${destination._id || destination.id || ""}`);
  const district = destination.district || "Karnali";
  const category = destination.category || "destination";
  const image = assetUrl(destinationImage(destination));
  const description = destination.description || destination.shortDescription || "Plan this Karnali destination with local route, stay, food, and weather context.";

  return {
    ...destination,
    id: destination._id || destination.id || slug,
    _id: destination._id || destination.id || slug,
    name,
    title: destination.title || name,
    slug,
    description,
    shortDescription: destination.shortDescription || description,
    longDescription: destination.longDescription || description,
    category,
    categoryLabel: destination.categoryLabel || titleCase(category),
    difficulty: destination.difficulty || "MODERATE",
    difficultyLabel: destination.difficultyLabel || "Confirm locally",
    district,
    districtSlug: destination.districtSlug || slugify(district),
    bestSeason: destination.bestSeason || destination.bestTimeToVisit || "Confirm locally",
    recommendedDuration: destination.recommendedDuration || "Flexible",
    estimatedCostRange: destination.estimatedCostRange || "Requires confirmation",
    entryFee: destination.entryFee || "Confirm locally",
    familyFriendly: destination.familyFriendly ?? true,
    requiresGuide: destination.requiresGuide ?? false,
    accessNotes: destination.accessNotes || "Confirm road, weather, permits, operator schedule, and local access before travel.",
    sourceNotes: destination.sourceNotes || "Public destination record from Pahuna admin. Confirm details locally before booking.",
    coverImage: image,
    image,
    gallery: (destination.gallery?.length ? destination.gallery : destination.images?.length ? destination.images : [image])
      .map((item: string) => assetUrl(item) || "/images/placeholders/destination-placeholder.svg"),
    attractions: destination.attractions || [],
    featured: Boolean(destination.featured || destination.isFeatured),
    isFeatured: Boolean(destination.featured || destination.isFeatured),
  };
}

async function getLiveDestinations() {
  const records = await getApi<Record<string, any>[]>("/destinations?page=1&limit=50");
  return records.map(normalizeDestination);
}

function fallbackDestinations() {
  return demoDestinations.map(normalizeDestination);
}

export async function getDestinations(..._args) {
  try {
    return await getLiveDestinations();
  } catch {
    return fallbackDestinations();
  }
}

export async function getFeaturedDestinations(limit = 6, ..._args) {
  const destinations = await getDestinations();
  return destinations.filter((item) => item.featured || item.isFeatured).slice(0, limit);
}

export async function getDestinationBySlug(slug: string, ..._args) {
  try {
    const destination = await getApi<Record<string, any>>(`/destinations/${encodeURIComponent(slug)}`);
    return normalizeDestination(destination);
  } catch {
    return fallbackDestinations().find((item) => item.slug === slug) ?? null;
  }
}

export async function getDestinationSlugs() {
  const destinations = await getDestinations();
  return destinations.map((item) => item.slug);
}

export async function getDestinationsByDistrict(districtSlug: string) {
  const destinations = await getDestinations();
  return destinations.filter(
    (item) =>
      item.districtSlug === districtSlug ||
      item.district.toLowerCase() === districtSlug.toLowerCase(),
  );
}

export async function getDistrictSlugs() {
  const destinations = await getDestinations();
  return Array.from(new Set(destinations.map((item) => item.districtSlug)));
}

export function toDistrictSlug(district: string) {
  return district.toLowerCase().replace(/\s+/g, "-");
}

export function fromDistrictSlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function getDestinationDistricts() {
  const destinations = await getDestinations();
  return Array.from(new Set(destinations.map((item) => item.district)));
}
