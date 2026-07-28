import {
  createAdminDestinationApi,
  deleteAdminDestinationApi,
  getAdminDestinationApi,
  getAdminDestinationsApi,
  updateAdminDestinationApi,
  type AdminDestinationListParams,
} from "@/lib/api/admin-destinations";
import type { AdminDestinationFormData } from "@/schemas/admin-destination.schema";

export async function getAdminDestinationsAction(
  params: AdminDestinationListParams,
) {
  return getAdminDestinationsApi(params);
}

export async function getAdminDestinationAction(id: string) {
  return getAdminDestinationApi(id);
}

export async function createAdminDestinationAction(
  data: AdminDestinationFormData,
  files?: FileList | File[],
) {
  return createAdminDestinationApi(data, files);
}

export async function updateAdminDestinationAction(
  id: string,
  data: AdminDestinationFormData,
  files?: FileList | File[],
) {
  return updateAdminDestinationApi(id, data, files);
}

export async function deleteAdminDestinationAction(id: string) {
  return deleteAdminDestinationApi(id);
}
