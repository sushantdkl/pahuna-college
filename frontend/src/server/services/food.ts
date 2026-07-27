export type PublicFoodProvider = any;

const API_BASE = (process.env.SERVER_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");
const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || API_BASE).replace(/\/api\/v1$/, "");
const foodFallbackImage = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80";
const coffeeShopImage = "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80";

const fallbackFoodProviders: PublicFoodProvider[] = [
  { id: "food-1", slug: "4s-cafe", name: "4S Cafe", type: "CAFE", typeLabel: "Cafe", district: "Surkhet", area: "Birendranagar", shortDescription: "Friendly local cafe.", longDescription: "A casual cafe for travelers.", image: foodFallbackImage, images: [foodFallbackImage], gallery: [foodFallbackImage], cuisines: ["Cafe", "Snacks"], services: ["Breakfast", "Coffee"], features: ["Family friendly"], priceLevel: "NPR 300 - 900", rating: 4.1, verificationStatus: "PUBLIC_LISTING", googleMapLink: "https://www.openstreetmap.org/search?query=4S%20Cafe%20Surkhet", latitude: 28.602, longitude: 81.634 },
  { id: "food-2", slug: "tuina-coffee-shop", name: "Tuina Coffee Shop", type: "CAFE", typeLabel: "Cafe", district: "Surkhet", area: "Birendranagar", shortDescription: "Coffee and quick bites.", longDescription: "A simple stop for coffee.", image: coffeeShopImage, images: [coffeeShopImage], gallery: [coffeeShopImage], cuisines: ["Coffee"], services: ["Coffee"], features: ["Local"], priceLevel: "NPR 250 - 800", rating: 4.0, verificationStatus: "PUBLIC_LISTING", googleMapLink: "https://www.openstreetmap.org/search?query=Tuina%20Coffee%20Surkhet", latitude: 28.603, longitude: 81.632 },
];

export const foodProviders: PublicFoodProvider[] = fallbackFoodProviders;

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

function assetUrl(value?: string) {
  if (!value || !value.startsWith("/uploads/")) return value;
  return `${API_ORIGIN}${value}`;
}

function titleCase(value?: string) {
  return String(value || "Food").replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

async function getApi<T>(path: string) {
  const response = await fetch(`${API_BASE}/api/v1${path}`, { cache: "no-store" });
  const payload = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !payload.success) throw new Error("Food API request failed");
  return payload.data;
}

function toFoodProvider(record: Record<string, any>): PublicFoodProvider {
  const images = (record.images?.length ? record.images : [foodFallbackImage]).map((image: string) => assetUrl(image));
  const mapsQuery = [record.name, record.area, record.district].filter(Boolean).join(", ");

  return {
    ...record,
    id: record._id || record.id || record.slug,
    _id: record._id || record.id,
    slug: record.slug,
    name: record.name,
    type: record.type || "FOOD",
    typeLabel: record.typeLabel || titleCase(record.type),
    district: record.district || "Karnali",
    area: record.area || "",
    address: record.address || "",
    shortDescription: record.shortDescription || record.description || "Local food provider.",
    longDescription: record.longDescription || record.shortDescription || record.description || "Local food provider.",
    image: images[0],
    images,
    gallery: images,
    cuisines: record.cuisines || [],
    services: record.services || [],
    features: record.features || [],
    priceLevel: record.priceLevel || "Confirm locally",
    openingHours: record.openingHours,
    rating: record.rating,
    reviewCount: record.reviewCount,
    verificationStatus: record.verificationStatus || "PUBLIC_LISTING",
    featured: Boolean(record.featured),
    active: Boolean(record.active ?? true),
    googleMapLink: `https://www.openstreetmap.org/search?query=${encodeURIComponent(mapsQuery || record.name)}`,
    latitude: record.latitude,
    longitude: record.longitude,
  };
}

function dedupeBySlug(items: PublicFoodProvider[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.slug || item.id;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function liveFoodProviders() {
  const records = await getApi<Record<string, any>[]>("/food-providers?page=1&limit=50");
  return dedupeBySlug(records.map(toFoodProvider));
}

export async function getFoodProviders(..._args: any[]) {
  try {
    const records = await liveFoodProviders();
    return records.length ? records : fallbackFoodProviders;
  } catch {
    return fallbackFoodProviders;
  }
}

export async function getFeaturedFoodProviders(limit = 6, ..._args: any[]) {
  const providers = await getFoodProviders();
  return providers.filter((item) => item.featured).slice(0, limit);
}

export async function getFoodProviderBySlug(slug: string, ..._args: any[]) {
  try {
    return toFoodProvider(await getApi<Record<string, any>>(`/food-providers/${encodeURIComponent(slug)}`));
  } catch {
    return fallbackFoodProviders.find((item) => item.slug === slug) ?? null;
  }
}

export async function getFoodProviderSlugs() {
  const providers = await getFoodProviders();
  return providers.map((item) => item.slug);
}

export async function getFoodProvidersForTripContext(..._args: any[]) {
  const providers = await getFoodProviders();
  return providers.slice(0, 4);
}

export function canShowFoodDirectContact(provider: PublicFoodProvider) {
  return provider.verificationStatus === "VERIFIED" || provider.verificationStatus === "PARTNER";
}

export function getFoodVerificationBadge(provider: PublicFoodProvider) {
  if (provider.verificationStatus === "VERIFIED" || provider.verificationStatus === "PARTNER") return "Verified";
  return "Public Listing";
}
