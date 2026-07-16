import { apiDelete, apiGet, apiPatch } from "./axios-instance";
import type {
  ContactMessageStatus,
  UpdateContactMessageFormData,
} from "@/schemas/contact-message.schema";

type AdminResponder = {
  _id: string;
  fullName: string;
  email: string;
};

export type AdminContactMessage = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  response?: string;
  respondedBy?: AdminResponder | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminContactMessageListParams = {
  page: number;
  limit: number;
  search?: string;
  status?: ContactMessageStatus | "";
};

function toQueryString(params: AdminContactMessageListParams) {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.search?.trim()) query.set("search", params.search.trim());
  if (params.status) query.set("status", params.status);

  return query.toString();
}

export function getAdminContactMessagesApi(
  params: AdminContactMessageListParams,
) {
  return apiGet<AdminContactMessage[]>(
    `/admin/contact-messages?${toQueryString(params)}`,
    true,
  );
}

export function getAdminContactMessageApi(id: string) {
  return apiGet<AdminContactMessage>(`/admin/contact-messages/${id}`, true);
}

export function updateAdminContactMessageApi(
  id: string,
  data: UpdateContactMessageFormData,
) {
  return apiPatch<AdminContactMessage>(
    `/admin/contact-messages/${id}`,
    data,
    true,
  );
}

export function deleteAdminContactMessageApi(id: string) {
  return apiDelete<{ deleted: boolean }>(
    `/admin/contact-messages/${id}`,
    true,
  );
}
