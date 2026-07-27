import { z } from "zod";

export const PartnerApplicationStatusSchema = z.enum([
  "PENDING",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
]);

export const PartnerTypeSchema = z.enum([
  "HOTEL",
  "RESORT",
  "RESTAURANT",
  "TRAVEL_AGENCY",
  "TRANSPORT",
  "OTHER",
]);

export const PartnerApplicationSchema = z.object({
  status: PartnerApplicationStatusSchema.default("PENDING"),
  businessName: z.string().trim().min(2).max(160),
  partnerType: PartnerTypeSchema,
  ownerName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(40),
  address: z.string().trim().max(300).optional(),
  website: z.string().trim().url().max(500).optional(),
  totalRooms: z.number().int().min(0).max(10000).optional(),
  currentRevenue: z.string().trim().max(120).optional(),
  existingOnline: z.boolean().default(false),
  challenges: z.string().trim().max(3000).optional(),
  goals: z.string().trim().max(3000).optional(),
  notes: z.string().trim().max(5000).optional(),
  reviewedBy: z.string().optional(),
  reviewedAt: z.date().optional(),
});

export type PartnerApplicationStatus = z.infer<
  typeof PartnerApplicationStatusSchema
>;
export type PartnerType = z.infer<typeof PartnerTypeSchema>;
export type PartnerApplicationType = z.infer<
  typeof PartnerApplicationSchema
>;
