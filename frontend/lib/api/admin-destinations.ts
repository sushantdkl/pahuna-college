import { apiDelete, apiGet, apiPatch, apiPost } from "./axios-instance";
import type { AdminDestinationFormData } from "@/schemas/admin-destination.schema";

export type AdminDestination = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  attractions: string[];
  bestTimeToVisit?: string;
  distanceFromSurkhetKm?: number;
  latitude?: number;
  longitude?: number;
  images: string[];
  category?: string;
  district?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminDestinationListParams = {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  district?: string;
  active?: string;
  featured?: string;
};

export type AdminDestinationDeleteResponse = {
  deleted: boolean;
};

function toQueryString(params: AdminDestinationListParams) {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.search?.trim()) searchParams.set("search", params.search.trim());
  if (params.category?.trim()) searchParams.set("category", params.category.trim());
  if (params.district?.trim()) searchParams.set("district", params.district.trim());
  if (params.active) searchParams.set("active", params.active);
  if (params.featured) searchParams.set("featured", params.featured);

  return searchParams.toString();
}

function toDestinationFormData(
  data: AdminDestinationFormData,
  files?: FileList | File[],
) {
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

export async function getAdminDestinationsApi(
  params: AdminDestinationListParams,
) {
  return apiGet<AdminDestination[]>(
    `/admin/destinations?${toQueryString(params)}`,
    true,
  );
}

export async function getAdminDestinationApi(id: string) {
  return apiGet<AdminDestination>(`/admin/destinations/${id}`, true);
}

export async function createAdminDestinationApi(
  data: AdminDestinationFormData,
  files?: FileList | File[],
) {
  return apiPost<AdminDestination>(
    "/admin/destinations",
    toDestinationFormData(data, files),
    true,
  );
}

export async function updateAdminDestinationApi(
  id: string,
  data: AdminDestinationFormData,
  files?: FileList | File[],
) {
  return apiPatch<AdminDestination>(
    `/admin/destinations/${id}`,
    toDestinationFormData(data, files),
    true,
  );
}

export async function deleteAdminDestinationApi(id: string) {
  return apiDelete<AdminDestinationDeleteResponse>(
    `/admin/destinations/${id}`,
    true,
  );
}
