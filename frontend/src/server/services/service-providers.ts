export type PublicServiceProvider = any;

const API_BASE = (process.env.SERVER_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050").replace(/\/$/, "");
const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || API_BASE).replace(/\/api\/v1$/, "");
const stayFallbackImage = "/images/hotel_room.jpg";
const resortFallbackImage = "/images/modern_hotel_room.jpg";

const fallbackProviders: PublicServiceProvider[] = [
  { id: "stay-1", slug: "hotel-suva", name: "Hotel Suva", type: "HOTEL", propertyType: "HOTEL", typeLabel: "Hotel", district: "Surkhet", area: "Birendranagar", address: "Birendranagar, Surkhet", shortDesc: "Comfortable city hotel in Surkhet.", shortDescription: "Comfortable city hotel in Surkhet.", longDescription: "A practical stay base for Surkhet and Karnali trips.", priceFrom: 2500, priceMin: 2500, currency: "NPR", rating: 4.2, verificationStatus: "VERIFIED", consentStatus: "APPROVED", featured: true, isFeatured: true, amenities: ["Wi-Fi", "Parking"], services: ["Rooms", "Food"], images: [stayFallbackImage], coverImage: stayFallbackImage, googleMapLink: "https://www.openstreetmap.org/search?query=Hotel%20Suva%20Surkhet", latitude: 28.6019, longitude: 81.6339 },
  { id: "stay-2", slug: "siddhartha-sunny-resort", name: "Siddhartha Sunny Resort", type: "RESORT", propertyType: "RESORT", typeLabel: "Resort", district: "Surkhet", area: "Birendranagar", address: "Surkhet", shortDesc: "Resort stay with local access.", shortDescription: "Resort stay with local access.", longDescription: "A comfortable resort option.", priceFrom: 6100, priceMin: 6100, currency: "NPR", rating: 4.4, verificationStatus: "VERIFIED", consentStatus: "APPROVED", featured: true, isFeatured: true, amenities: ["Garden", "Restaurant"], services: ["Rooms"], images: [resortFallbackImage], coverImage: resortFallbackImage, googleMapLink: "https://www.openstreetmap.org/search?query=Siddhartha%20Sunny%20Resort", latitude: 28.59, longitude: 81.62 },
];

export const serviceProviders: PublicServiceProvider[] = fallbackProviders;

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

function assetUrl(value?: string) {
  if (!value || !value.startsWith("/uploads/")) return value;
  return `${API_ORIGIN}${value}`;
}

function titleCase(value?: string) {
  return String(value || "Stay").replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function areaFrom(address?: string, district?: string) {
  return address?.split(",")[0]?.trim() || district || "Karnali";
}

async function getApi<T>(path: string) {
  const response = await fetch(`${API_BASE}/api/v1${path}`, { cache: "no-store" });
  const payload = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !payload.success) throw new Error("Stay API request failed");
  return payload.data;
}

function toProvider(record: Record<string, any>): PublicServiceProvider {
  const propertyType = record.propertyType || record.type || "HOTEL";
  const sourceImages = record.images?.length
    ? record.images
    : [record.image, record.coverImage, record.featuredImage].filter(Boolean);
  const images = (sourceImages.length ? sourceImages : [stayFallbackImage]).map((image: string) => assetUrl(image));
  const mapsQuery = [record.name, record.address, record.district].filter(Boolean).join(", ");

  return {
    ...record,
    id: record._id || record.id || record.slug,
    _id: record._id || record.id,
    slug: record.slug,
    name: record.name,
    type: propertyType,
    propertyType,
    typeLabel: titleCase(propertyType),
    district: record.district || "Karnali",
    area: record.area || areaFrom(record.address, record.district),
    address: record.address || "",
    shortDesc: record.shortDesc || record.shortDescription || record.description,
    shortDescription: record.shortDescription || record.shortDesc || record.description,
    longDescription: record.longDescription || record.description,
    priceFrom: record.priceMin,
    priceMin: record.priceMin,
    priceMax: record.priceMax,
    currency: "NPR",
    rating: record.rating ?? record.starRating,
    starRating: record.starRating,
    verificationStatus: record.isVerified ? "VERIFIED" : "PUBLIC_LISTING",
    consentStatus: record.isVerified ? "APPROVED" : "PENDING",
    featured: Boolean(record.isFeatured),
    isFeatured: Boolean(record.isFeatured),
    isActive: Boolean(record.isActive ?? true),
    amenities: record.amenities || [],
    services: record.services || [],
    images,
    coverImage: images[0],
    gallery: images,
    googleMapLink: `https://www.openstreetmap.org/search?query=${encodeURIComponent(mapsQuery || record.name)}`,
    latitude: record.latitude,
    longitude: record.longitude,
  };
}

function dedupeBySlug(items: PublicServiceProvider[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.slug || item.id;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function liveProviders() {
  const records = await getApi<Record<string, any>[]>("/hotels?page=1&limit=50");
  return dedupeBySlug(records.map(toProvider));
}

export async function getServiceProviders(..._args: any[]) {
  try {
    const records = await liveProviders();
    return records.length ? records : fallbackProviders;
  } catch {
    return fallbackProviders;
  }
}

export async function getFeaturedServiceProviders(limit = 6, ..._args: any[]) {
  const providers = await getServiceProviders();
  return providers.filter((item) => item.featured || item.isFeatured).slice(0, limit);
}

export async function getProvidersByDistrict(district: string) {
  const providers = await getServiceProviders();
  return providers.filter((item) => item.district?.toLowerCase() === district.toLowerCase());
}

export async function getServiceProviderBySlug(slug: string, ..._args: any[]) {
  try {
    return toProvider(await getApi<Record<string, any>>(`/hotels/${encodeURIComponent(slug)}`));
  } catch {
    return fallbackProviders.find((item) => item.slug === slug) ?? null;
  }
}

export async function getServiceProviderSlugs() {
  const providers = await getServiceProviders();
  return providers.map((item) => item.slug);
}

export function canShowDirectContact(provider: PublicServiceProvider) {
  return provider.consentStatus === "APPROVED" || provider.verificationStatus === "VERIFIED" || provider.verificationStatus === "PARTNER";
}

export function getVerificationBadge(provider: PublicServiceProvider) {
  if (provider.verificationStatus === "VERIFIED" || provider.verificationStatus === "PARTNER") return "Verified";
  return "Public Listing";
}

export function isStayProviderType(type?: string) {
  return ["HOTEL", "RESORT", "HOMESTAY", "GUEST_HOUSE", "GUESTHOUSE", "LODGE"].includes(String(type ?? "").toUpperCase());
}
