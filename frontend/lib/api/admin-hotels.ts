import { apiDelete, apiGet, apiPatch, apiPost } from "./axios-instance";
import type { AdminHotelFormData } from "@/schemas/admin-hotel.schema";

export type AdminHotel = {
  _id: string;
  ownerId?: string;
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
  contactPhone?: string;
  email?: string;
  images: string[];
  isVerified: boolean;
  isFeatured: boolean;
  isActive: boolean;
  totalRooms?: number;
  availableRooms?: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminHotelListParams = {
  page: number;
  limit: number;
  search?: string;
  propertyType?: string;
  district?: string;
  verified?: string;
  featured?: string;
};

export type AdminHotelDeleteResponse = {
  deleted: boolean;
};

function toQueryString(params: AdminHotelListParams) {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.search?.trim()) searchParams.set("search", params.search.trim());
  if (params.propertyType?.trim()) searchParams.set("type", params.propertyType.trim());
  if (params.district?.trim()) searchParams.set("district", params.district.trim());
  if (params.verified) searchParams.set("verified", params.verified);
  if (params.featured) searchParams.set("featured", params.featured);

  return searchParams.toString();
}

function toHotelFormData(data: AdminHotelFormData, files?: FileList | File[]) {
  const formData = new FormData();
  const fileArray = files ? Array.from(files) : [];

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === "") return;

    if (Array.isArray(value)) {
      formData.set(key, JSON.stringify(value));
      return;
    }

    formData.set(key, String(value));
  });

  fileArray.forEach((file) => {
    formData.append("images", file);
  });

  return formData;
}

export async function getAdminHotelsApi(params: AdminHotelListParams) {
  return apiGet<AdminHotel[]>(`/admin/hotels?${toQueryString(params)}`, true);
}

export async function getAdminHotelApi(id: string) {
  return apiGet<AdminHotel>(`/admin/hotels/${id}`, true);
}

export async function createAdminHotelApi(
  data: AdminHotelFormData,
  files?: FileList | File[],
) {
  return apiPost<AdminHotel>("/admin/hotels", toHotelFormData(data, files), true);
}

export async function updateAdminHotelApi(
  id: string,
  data: AdminHotelFormData,
  files?: FileList | File[],
) {
  return apiPatch<AdminHotel>(
    `/admin/hotels/${id}`,
    toHotelFormData(data, files),
    true,
  );
}

export async function deleteAdminHotelApi(id: string) {
  return apiDelete<AdminHotelDeleteResponse>(`/admin/hotels/${id}`, true);
}
