import { apiPost } from "./axios-instance";
import type {
  CreateInquiryFormData,
  InquiryKind,
  InquiryStatus,
} from "@/schemas/inquiry.schema";

export type CreatedInquiry = {
  _id: string;
  userId: string;
  hotelId?: string;
  title: string;
  message: string;
  inquiryType: InquiryKind;
  status: InquiryStatus;
  response?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
};

export async function createInquiryApi(data: CreateInquiryFormData) {
  return apiPost<CreatedInquiry>("/inquiries", data, true);
}
