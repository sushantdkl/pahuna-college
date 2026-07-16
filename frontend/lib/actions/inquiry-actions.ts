import { createInquiryApi } from "@/lib/api/inquiries";
import type { CreateInquiryFormData } from "@/schemas/inquiry.schema";

export async function createInquiryAction(data: CreateInquiryFormData) {
  return createInquiryApi(data);
}
