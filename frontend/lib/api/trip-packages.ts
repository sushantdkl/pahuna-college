import { apiGet, apiPost, resolveApiAssetUrl } from "@/lib/api/axios-instance";
import type { TripPackageFormData } from "@/schemas/trip-package.schema";

export type TripPackageDestination = {
  _id: string;
  name: string;
  slug?: string;
  district?: string;
};

export type TripPackage = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  destinationId?: string | TripPackageDestination;
  durationDays?: number;
  price?: number;
  priceMin?: number;
  priceMax?: number;
  itinerary: string[];
  inclusions: string[];
  exclusions: string[];
  highlights: string[];
  difficulty?: string;
  groupSize?: string;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TripPackageListParams = {
  page?: number;
  limit?: number;
  search?: string;
  featured?: boolean | "";
  destinationId?: string;
  difficulty?: string;
};

function queryString(params: Record<string, unknown>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const value = query.toString();
  return value ? `?${value}` : "";
}

function normalizeTripPackage(pkg: TripPackage): TripPackage {
  return {
    ...pkg,
    images: (pkg.images || []).map((image) => resolveApiAssetUrl(image) || image),
  };
}

export async function getTripPackages(params: TripPackageListParams = {}) {
  const response = await apiGet<TripPackage[]>(`/trip-packages${queryString(params)}`);
  return { ...response, data: response.data?.map(normalizeTripPackage) || [] };
}

export async function getTripPackage(slug: string) {
  const response = await apiGet<TripPackage>(`/trip-packages/${encodeURIComponent(slug)}`);
  return { ...response, data: response.data ? normalizeTripPackage(response.data) : null };
}

export function createTripPackageInquiry(tripPackage: TripPackage) {
  return apiPost(
    "/inquiries",
    {
      tripPackageId: tripPackage._id,
      title: `Trip package reservation: ${tripPackage.title}`,
      message: `I want to reserve or discuss the ${tripPackage.title} package.`,
      inquiryType: "TRAVEL_SUPPORT",
    },
    true,
  );
}

export type AdminTripPackagePayload = TripPackageFormData;
