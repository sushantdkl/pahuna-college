import {
  createAdminHotelApi,
  deleteAdminHotelApi,
  getAdminHotelApi,
  getAdminHotelsApi,
  updateAdminHotelApi,
  type AdminHotelListParams,
} from "@/lib/api/admin-hotels";
import type { AdminHotelFormData } from "@/schemas/admin-hotel.schema";

export async function getAdminHotelsAction(params: AdminHotelListParams) {
  return getAdminHotelsApi(params);
}

export async function getAdminHotelAction(id: string) {
  return getAdminHotelApi(id);
}

export async function createAdminHotelAction(
  data: AdminHotelFormData,
  files?: FileList | File[],
) {
  return createAdminHotelApi(data, files);
}

export async function updateAdminHotelAction(
  id: string,
  data: AdminHotelFormData,
  files?: FileList | File[],
) {
  return updateAdminHotelApi(id, data, files);
}

export async function deleteAdminHotelAction(id: string) {
  return deleteAdminHotelApi(id);
}
