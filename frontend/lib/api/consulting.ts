import { apiGet, apiPost } from "@/lib/api/axios-instance";
import type {
  ConsultingLeadFormData,
  ConsultingLeadStatus,
} from "@/schemas/consulting.schema";

export type ConsultingService = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category?: string;
  price?: string;
  duration?: string;
  deliverables: string[];
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ConsultingLead = {
  _id: string;
  serviceId?: string | Pick<ConsultingService, "_id" | "title" | "slug" | "category">;
  name: string;
  contactName?: string;
  email: string;
  phone: string;
  businessName?: string;
  businessType?: string;
  businessStage?: string;
  stage?: string;
  businessSize?: string;
  location?: string;
  serviceType?: string;
  timeline?: string;
  budget?: string;
  budgetRange?: string;
  message: string;
  status: ConsultingLeadStatus;
  response?: string;
  assignedTo?: string | { _id: string; fullName: string; email?: string };
  createdAt: string;
  updatedAt: string;
};

export type ConsultingServiceListParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
};

function queryString(params: Record<string, unknown>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const value = query.toString();
  return value ? `?${value}` : "";
}

export function getConsultingServices(params: ConsultingServiceListParams = {}) {
  return apiGet<ConsultingService[]>(`/consulting-services${queryString(params)}`);
}

export function getConsultingService(slug: string) {
  return apiGet<ConsultingService>(`/consulting-services/${encodeURIComponent(slug)}`);
}

export function createConsultingLead(payload: ConsultingLeadFormData) {
  return apiPost<ConsultingLead>("/consulting-leads", payload);
}
