import { apiGet, resolveApiAssetUrl } from "@/lib/api/axios-instance";
import type { StayCard } from "@/lib/pahuna-content";

export type PublicHotel = {
  _id: string;
  slug: string;
  name: string;
  description: string;
  address: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  propertyType: string;
  starRating?: number;
  priceMin?: number;
  priceMax?: number;
  amenities: string[];
  images: string[];
  isVerified: boolean;
  isFeatured: boolean;
  availableRooms?: number;
};

export type PublicDestination = {
  _id: string;
  slug: string;
  name: string;
  description: string;
  attractions: string[];
  bestTimeToVisit?: string;
  distanceFromSurkhetKm?: number;
  latitude?: number;
  longitude?: number;
  images: string[];
  category?: string;
  district?: string;
  isFeatured: boolean;
};

export type PublicExperience = {
  _id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price?: number;
  duration?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  maxParticipants?: number;
  images: string[];
  rating?: number;
  reviewCount?: number;
};

export type PublicCatalogParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  propertyType?: string;
  district?: string;
  featured?: boolean;
};

function queryString(params: PublicCatalogParams) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const value = query.toString();
  return value ? `?${value}` : "";
}

export function getHotels(params: PublicCatalogParams = {}) {
  return apiGet<PublicHotel[]>(`/hotels${queryString(params)}`);
}

export function getHotel(identifier: string) {
  return apiGet<PublicHotel>(`/hotels/${encodeURIComponent(identifier)}`);
}

export function getDestinations(params: PublicCatalogParams = {}) {
  return apiGet<PublicDestination[]>(`/destinations${queryString(params)}`);
}

export function getDestination(identifier: string) {
  return apiGet<PublicDestination>(`/destinations/${encodeURIComponent(identifier)}`);
}

export function getExperiences(params: PublicCatalogParams = {}) {
  return apiGet<PublicExperience[]>(`/experiences${queryString(params)}`);
}

export function getExperience(identifier: string) {
  return apiGet<PublicExperience>(`/experiences/${encodeURIComponent(identifier)}`);
}

export function publicHotelToStay(hotel: PublicHotel): StayCard {
  const area = hotel.address.split(",")[0]?.trim() || hotel.district || "Surkhet";
  const mapsQuery = [hotel.name, hotel.address, hotel.district].filter(Boolean).join(", ");

  return {
    slug: hotel.slug,
    name: hotel.name,
    type: hotel.propertyType,
    typeLabel: hotel.propertyType,
    area,
    district: hotel.district || "Surkhet",
    address: hotel.address,
    priceFrom: hotel.priceMin ? `NPR ${hotel.priceMin.toLocaleString()}` : "Ask price",
    priceValue: hotel.priceMin,
    currency: "NPR",
    rating: hotel.starRating,
    verified: hotel.isVerified,
    featured: hotel.isFeatured,
    publicListing: !hotel.isVerified,
    verificationStatus: hotel.isVerified ? "VERIFIED" : "PUBLIC_LISTING",
    consentStatus: "PENDING",
    shortDescription: hotel.description,
    longDescription: hotel.description,
    amenities: hotel.amenities,
    services: [],
    image: resolveApiAssetUrl(hotel.images[0]) || "/images/placeholders/stay-placeholder.svg",
    gallery: hotel.images.map((image) => resolveApiAssetUrl(image) || image),
    googleMapLink: `https://maps.google.com/?q=${encodeURIComponent(mapsQuery)}`,
    latitude: hotel.latitude,
    longitude: hotel.longitude,
  };
}
