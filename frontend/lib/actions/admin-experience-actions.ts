import {
  createAdminExperienceApi,
  deleteAdminExperienceApi,
  getAdminExperienceApi,
  getAdminExperiencesApi,
  updateAdminExperienceApi,
  type AdminExperienceListParams,
} from "@/lib/api/admin-experiences";
import type { AdminExperienceFormData } from "@/schemas/admin-experience.schema";

export async function getAdminExperiencesAction(
  params: AdminExperienceListParams,
) {
  return getAdminExperiencesApi(params);
}

export async function getAdminExperienceAction(id: string) {
  return getAdminExperienceApi(id);
}

export async function createAdminExperienceAction(
  data: AdminExperienceFormData,
  files?: FileList | File[],
) {
  return createAdminExperienceApi(data, files);
}

export async function updateAdminExperienceAction(
  id: string,
  data: AdminExperienceFormData,
  files?: FileList | File[],
) {
  return updateAdminExperienceApi(id, data, files);
}

export async function deleteAdminExperienceAction(id: string) {
  return deleteAdminExperienceApi(id);
}
