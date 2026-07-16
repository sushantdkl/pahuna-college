import { apiPost } from "./axios-instance";
import type {
  ContactMessageStatus,
  CreateContactMessageFormData,
} from "@/schemas/contact-message.schema";

export type CreatedContactMessage = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: string;
  updatedAt: string;
};

export function createContactMessageApi(data: CreateContactMessageFormData) {
  return apiPost<CreatedContactMessage>("/contact-messages", data);
}
