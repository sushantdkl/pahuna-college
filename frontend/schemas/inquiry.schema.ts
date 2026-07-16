import { z } from "zod";

export const inquiryTypeSchema = z.enum([
  "HOTEL",
  "AVAILABILITY",
  "BOOKING",
  "RESERVATION",
  "TRAVEL_SUPPORT",
  "GENERAL",
]);

export const inquiryStatusSchema = z.enum([
  "NEW",
  "IN_PROGRESS",
  "RESPONDED",
  "CLOSED",
]);

export const createInquirySchema = z.object({
  hotelId: z.string().trim().optional(),
  hotelName: z.string().trim().optional(),
  title: z.string().trim().min(1, "Title is required").max(160),
  message: z.string().trim().min(1, "Message is required").max(5000),
  inquiryType: inquiryTypeSchema,
});

export const updateInquirySchema = z
  .object({
    status: inquiryStatusSchema.optional(),
    response: z.string().trim().min(1, "Response is required").max(5000).optional(),
    assignedTo: z.string().trim().optional(),
  })
  .refine((data) => Object.values(data).some(Boolean), {
    message: "Choose a status or enter a response",
  });

export type CreateInquiryFormData = z.infer<typeof createInquirySchema>;
export type UpdateInquiryFormData = z.infer<typeof updateInquirySchema>;
export type InquiryStatus = z.infer<typeof inquiryStatusSchema>;
export type InquiryKind = z.infer<typeof inquiryTypeSchema>;
