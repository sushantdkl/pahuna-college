import {
  createAdminConsultingService,
  deleteAdminConsultingLead,
  deleteAdminConsultingService,
  getAdminConsultingLeads,
  getAdminConsultingServices,
  updateAdminConsultingLead,
  updateAdminConsultingService,
} from "@/lib/api/admin-consulting";

export const getAdminConsultingServicesAction = getAdminConsultingServices;
export const createAdminConsultingServiceAction = createAdminConsultingService;
export const updateAdminConsultingServiceAction = updateAdminConsultingService;
export const deleteAdminConsultingServiceAction = deleteAdminConsultingService;
export const getAdminConsultingLeadsAction = getAdminConsultingLeads;
export const updateAdminConsultingLeadAction = updateAdminConsultingLead;
export const deleteAdminConsultingLeadAction = deleteAdminConsultingLead;
