import { z } from "zod";

export const contactMessageStatusSchema = z.enum([
  "NEW",
  "READ",
  "RESPONDED",
  "CLOSED",
]);

export const createContactMessageSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email address").max(254),
  phone: z.string().trim().max(40).optional(),
  subject: z.string().trim().min(1, "Subject is required").max(160),
  message: z.string().trim().min(1, "Message is required").max(5000),
});

export const updateContactMessageSchema = z
  .object({
    status: contactMessageStatusSchema.optional(),
    response: z.string().trim().min(1, "Response is required").max(5000).optional(),
  })
  .refine((data) => Object.values(data).some(Boolean), {
    message: "Choose a status or enter a response",
  });

export type CreateContactMessageFormData = z.infer<
  typeof createContactMessageSchema
>;
export type UpdateContactMessageFormData = z.infer<
  typeof updateContactMessageSchema
>;
export type ContactMessageStatus = z.infer<
  typeof contactMessageStatusSchema
>;
