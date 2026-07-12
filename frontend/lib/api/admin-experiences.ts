import { apiDelete, apiGet, apiPatch, apiPost } from "./axios-instance";
import type { AdminExperienceFormData } from "@/schemas/admin-experience.schema";

export type AdminExperience = {
  _id: string;
  providerId?: string;
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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminExperienceListParams = {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  active?: string;
  providerId?: string;
};

export type AdminExperienceDeleteResponse = {
  deleted: boolean;
};

function toQueryString(params: AdminExperienceListParams) {
  const searchParams = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.search?.trim()) searchParams.set("search", params.search.trim());
  if (params.category?.trim()) searchParams.set("category", params.category.trim());
  if (params.active) searchParams.set("active", params.active);
  if (params.providerId?.trim()) searchParams.set("providerId", params.providerId.trim());

  return searchParams.toString();
}

function toExperienceFormData(
  data: AdminExperienceFormData,
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

export async function getAdminExperiencesApi(params: AdminExperienceListParams) {
  return apiGet<AdminExperience[]>(
    `/admin/experiences?${toQueryString(params)}`,
    true,
  );
}

export async function getAdminExperienceApi(id: string) {
  return apiGet<AdminExperience>(`/admin/experiences/${id}`, true);
}

export async function createAdminExperienceApi(
  data: AdminExperienceFormData,
  files?: FileList | File[],
) {
  return apiPost<AdminExperience>(
    "/admin/experiences",
    toExperienceFormData(data, files),
    true,
  );
}

export async function updateAdminExperienceApi(
  id: string,
  data: AdminExperienceFormData,
  files?: FileList | File[],
) {
  return apiPatch<AdminExperience>(
    `/admin/experiences/${id}`,
    toExperienceFormData(data, files),
    true,
  );
}

export async function deleteAdminExperienceApi(id: string) {
  return apiDelete<AdminExperienceDeleteResponse>(
    `/admin/experiences/${id}`,
    true,
  );
}
