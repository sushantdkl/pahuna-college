import { apiPost } from "./axios-instance";
import type {
  CreatePartnerApplicationFormData,
  PartnerApplicationStatus,
  PartnerType,
} from "@/schemas/partner-application.schema";

export type CreatedPartnerApplication = {
  _id: string;
  status: PartnerApplicationStatus;
  businessName: string;
  partnerType: PartnerType;
  ownerName: string;
  email: string;
  phone: string;
  createdAt: string;
};

export function createPartnerApplicationApi(
  data: CreatePartnerApplicationFormData,
) {
  return apiPost<CreatedPartnerApplication>("/partner-applications", data);
}
