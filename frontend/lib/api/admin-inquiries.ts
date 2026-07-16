import { apiDelete, apiGet, apiPatch } from "./axios-instance";
import type {
  InquiryKind,
  InquiryStatus,
  UpdateInquiryFormData,
} from "@/schemas/inquiry.schema";

type InquiryUser = {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
};

type InquiryHotel = {
  _id: string;
  name: string;
  address: string;
  propertyType: string;
};

export type AdminInquiry = {
  _id: string;
  userId: InquiryUser | null;
  hotelId?: InquiryHotel;
  title: string;
  message: string;
  inquiryType: InquiryKind;
  status: InquiryStatus;
  response?: string;
  assignedTo?: InquiryUser | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminInquiryListParams = {
  page: number;
  limit: number;
  search?: string;
  status?: InquiryStatus | "";
  inquiryType?: InquiryKind | "";
  hotelId?: string;
};

function toQueryString(params: AdminInquiryListParams) {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.search?.trim()) query.set("search", params.search.trim());
  if (params.status) query.set("status", params.status);
  if (params.inquiryType) query.set("type", params.inquiryType);
  if (params.hotelId) query.set("hotelId", params.hotelId);

  return query.toString();
}

export function getAdminInquiriesApi(params: AdminInquiryListParams) {
  return apiGet<AdminInquiry[]>(
    `/admin/inquiries?${toQueryString(params)}`,
    true,
  );
}

export function getAdminInquiryApi(id: string) {
  return apiGet<AdminInquiry>(`/admin/inquiries/${id}`, true);
}

export function updateAdminInquiryApi(
  id: string,
  data: UpdateInquiryFormData,
) {
  return apiPatch<AdminInquiry>(`/admin/inquiries/${id}`, data, true);
}

export function deleteAdminInquiryApi(id: string) {
  return apiDelete<{ deleted: boolean }>(`/admin/inquiries/${id}`, true);
}
