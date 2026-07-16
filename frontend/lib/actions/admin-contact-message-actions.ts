import {
  deleteAdminContactMessageApi,
  getAdminContactMessageApi,
  getAdminContactMessagesApi,
  updateAdminContactMessageApi,
  type AdminContactMessageListParams,
} from "@/lib/api/admin-contact-messages";
import type { UpdateContactMessageFormData } from "@/schemas/contact-message.schema";

export function getAdminContactMessagesAction(
  params: AdminContactMessageListParams,
) {
  return getAdminContactMessagesApi(params);
}

export function getAdminContactMessageAction(id: string) {
  return getAdminContactMessageApi(id);
}

export function updateAdminContactMessageAction(
  id: string,
  data: UpdateContactMessageFormData,
) {
  return updateAdminContactMessageApi(id, data);
}

export function deleteAdminContactMessageAction(id: string) {
  return deleteAdminContactMessageApi(id);
}
