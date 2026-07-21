import { createPartnerApplicationApi } from "@/lib/api/partner-applications";
import type { CreatePartnerApplicationFormData } from "@/schemas/partner-application.schema";

export function createPartnerApplicationAction(
  data: CreatePartnerApplicationFormData,
) {
  return createPartnerApplicationApi(data);
}
