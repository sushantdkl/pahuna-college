import { apiDelete, apiGet, apiPatch } from "./axios-instance";
import type {
  PartnerApplicationStatus,
  PartnerType,
  UpdatePartnerApplicationFormData,
} from "@/schemas/partner-application.schema";

export type PartnerReviewer = {
  _id: string;
  fullName: string;
  email: string;
};

export type AdminPartnerApplication = {
  _id: string;
  status: PartnerApplicationStatus;
  businessName: string;
  partnerType: PartnerType;
  ownerName: string;
  email: string;
  phone: string;
  address?: string;
  website?: string;
  totalRooms?: number;
  currentRevenue?: string;
  existingOnline: boolean;
  challenges?: string;
  goals?: string;
  notes?: string;
  reviewedBy?: PartnerReviewer | string | null;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminPartnerApplicationListParams = {
  page: number;
  limit: number;
  search?: string;
  status?: PartnerApplicationStatus | "";
  type?: PartnerType | "";
};

function toQueryString(params: AdminPartnerApplicationListParams) {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.search?.trim()) query.set("search", params.search.trim());
  if (params.status) query.set("status", params.status);
  if (params.type) query.set("type", params.type);

  return query.toString();
}

export function getAdminPartnerApplicationsApi(
  params: AdminPartnerApplicationListParams,
) {
  return apiGet<AdminPartnerApplication[]>(
    `/admin/partner-applications?${toQueryString(params)}`,
    true,
  );
}

export function getAdminPartnerApplicationApi(id: string) {
  return apiGet<AdminPartnerApplication>(
    `/admin/partner-applications/${id}`,
    true,
  );
}

export function updateAdminPartnerApplicationApi(
  id: string,
  data: UpdatePartnerApplicationFormData,
) {
  return apiPatch<AdminPartnerApplication>(
    `/admin/partner-applications/${id}`,
    data,
    true,
  );
}

export function deleteAdminPartnerApplicationApi(id: string) {
  return apiDelete<{ deleted: boolean }>(
    `/admin/partner-applications/${id}`,
    true,
  );
}
