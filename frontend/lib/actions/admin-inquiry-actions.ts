import {
  deleteAdminInquiryApi,
  getAdminInquiryApi,
  getAdminInquiriesApi,
  updateAdminInquiryApi,
  type AdminInquiryListParams,
} from "@/lib/api/admin-inquiries";
import type { UpdateInquiryFormData } from "@/schemas/inquiry.schema";

export function getAdminInquiriesAction(params: AdminInquiryListParams) {
  return getAdminInquiriesApi(params);
}

export function getAdminInquiryAction(id: string) {
  return getAdminInquiryApi(id);
}

export function updateAdminInquiryAction(
  id: string,
  data: UpdateInquiryFormData,
) {
  return updateAdminInquiryApi(id, data);
}

export function deleteAdminInquiryAction(id: string) {
  return deleteAdminInquiryApi(id);
}
