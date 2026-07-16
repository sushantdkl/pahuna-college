import { createContactMessageApi } from "@/lib/api/contact-messages";
import type { CreateContactMessageFormData } from "@/schemas/contact-message.schema";

export function createContactMessageAction(data: CreateContactMessageFormData) {
  return createContactMessageApi(data);
}
