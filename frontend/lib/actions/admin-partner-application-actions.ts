import {
  deleteAdminPartnerApplicationApi,
  getAdminPartnerApplicationApi,
  getAdminPartnerApplicationsApi,
  updateAdminPartnerApplicationApi,
  type AdminPartnerApplicationListParams,
} from "@/lib/api/admin-partner-applications";
import type { UpdatePartnerApplicationFormData } from "@/schemas/partner-application.schema";

export function getAdminPartnerApplicationsAction(
  params: AdminPartnerApplicationListParams,
) {
  return getAdminPartnerApplicationsApi(params);
}

export function getAdminPartnerApplicationAction(id: string) {
  return getAdminPartnerApplicationApi(id);
}

export function updateAdminPartnerApplicationAction(
  id: string,
  data: UpdatePartnerApplicationFormData,
) {
  return updateAdminPartnerApplicationApi(id, data);
}

export function deleteAdminPartnerApplicationAction(id: string) {
  return deleteAdminPartnerApplicationApi(id);
}
