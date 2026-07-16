import { z } from "zod";

export const ContactMessageStatusSchema = z.enum([
  "NEW",
  "READ",
  "RESPONDED",
  "CLOSED",
]);

export const ContactMessageSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(40).optional(),
  subject: z.string().trim().min(1).max(160),
  message: z.string().trim().min(1).max(5000),
  status: ContactMessageStatusSchema.default("NEW"),
  response: z.string().trim().max(5000).optional(),
  respondedBy: z.string().trim().optional(),
});

export type ContactMessageType = z.infer<typeof ContactMessageSchema>;
export type ContactMessageStatus = z.infer<
  typeof ContactMessageStatusSchema
>;
