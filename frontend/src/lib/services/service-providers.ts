import { featuredStays } from "../../../lib/pahuna-content";

export async function getFeaturedServiceProviders(limit = 3) {
  return featuredStays.slice(0, limit).map((stay) => ({
    id: stay.slug,
    name: stay.name,
    slug: stay.slug,
    shortDescription: stay.shortDescription || "",
    type: stay.type.toUpperCase().replaceAll(" ", "_"),
    typeLabel: stay.typeLabel || stay.type,
    district: stay.district,
    area: stay.area,
    address: stay.address,
    priceFrom: stay.priceValue || undefined,
    currency: stay.currency || "NPR",
    rating: stay.rating,
    verificationStatus: stay.verificationStatus,
    consentStatus: stay.consentStatus,
    amenities: stay.amenities || [],
    services: stay.services || [],
    images: stay.gallery?.length ? stay.gallery : [stay.image],
    featured: stay.featured,
    latitude: stay.latitude,
    longitude: stay.longitude,
  }));
}
