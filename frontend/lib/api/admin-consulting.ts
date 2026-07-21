import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api/axios-instance";
import type { ConsultingLead, ConsultingService } from "@/lib/api/consulting";
import type {
  ConsultingLeadStatus,
  ConsultingServiceFormData,
} from "@/schemas/consulting.schema";

export type AdminConsultingService = ConsultingService;
export type AdminConsultingLead = ConsultingLead;

export type AdminConsultingServiceListParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  active?: boolean | "";
};

export type AdminConsultingLeadListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: ConsultingLeadStatus | "";
  serviceId?: string;
};

function queryString(params: Record<string, unknown>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const value = query.toString();
  return value ? `?${value}` : "";
}

export function getAdminConsultingServices(params: AdminConsultingServiceListParams = {}) {
  return apiGet<AdminConsultingService[]>(
    `/admin/consulting-services${queryString(params)}`,
    true,
  );
}

export function createAdminConsultingService(payload: ConsultingServiceFormData) {
  return apiPost<AdminConsultingService>("/admin/consulting-services", payload, true);
}

export function updateAdminConsultingService(id: string, payload: Partial<ConsultingServiceFormData>) {
  return apiPatch<AdminConsultingService>(`/admin/consulting-services/${id}`, payload, true);
}

export function deleteAdminConsultingService(id: string) {
  return apiDelete<{ deleted: true }>(`/admin/consulting-services/${id}`, true);
}

export function getAdminConsultingLeads(params: AdminConsultingLeadListParams = {}) {
  return apiGet<AdminConsultingLead[]>(
    `/admin/consulting-leads${queryString(params)}`,
    true,
  );
}

export function updateAdminConsultingLead(
  id: string,
  payload: { status?: ConsultingLeadStatus; response?: string },
) {
  return apiPatch<AdminConsultingLead>(`/admin/consulting-leads/${id}`, payload, true);
}

export function deleteAdminConsultingLead(id: string) {
  return apiDelete<{ deleted: true }>(`/admin/consulting-leads/${id}`, true);
}
