import { z } from "zod";

export const InquiryTypeSchema = z.enum([
  "HOTEL",
  "AVAILABILITY",
  "BOOKING",
  "RESERVATION",
  "TRAVEL_SUPPORT",
  "GENERAL",
]);

export const InquiryStatusSchema = z.enum([
  "NEW",
  "IN_PROGRESS",
  "RESPONDED",
  "CLOSED",
]);

export const InquirySchema = z.object({
  userId: z.string().trim().min(1),
  hotelId: z.string().trim().optional(),
  title: z.string().trim().min(1).max(160),
  message: z.string().trim().min(1).max(5000),
  inquiryType: InquiryTypeSchema,
  status: InquiryStatusSchema.default("NEW"),
  response: z.string().trim().max(5000).optional(),
  assignedTo: z.string().trim().optional(),
});

export type InquiryType = z.infer<typeof InquirySchema>;
export type InquiryKind = z.infer<typeof InquiryTypeSchema>;
export type InquiryStatus = z.infer<typeof InquiryStatusSchema>;
