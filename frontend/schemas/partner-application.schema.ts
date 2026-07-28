import { z } from "zod";

export const partnerApplicationStatusSchema = z.enum([
  "PENDING",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
]);

export const partnerTypeSchema = z.enum([
  "HOTEL",
  "RESORT",
  "RESTAURANT",
  "TRAVEL_AGENCY",
  "TRANSPORT",
  "OTHER",
]);

export const createPartnerApplicationSchema = z.object({
  businessName: z.string().trim().min(2, "Business name is required").max(160),
  partnerType: partnerTypeSchema,
  ownerName: z.string().trim().min(2, "Owner name is required").max(120),
  email: z.string().trim().email("Enter a valid email address").max(254),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(40),
  address: z.string().trim().max(300).optional(),
  website: z.string().trim().url("Enter a valid website URL").max(500).optional(),
  totalRooms: z.number().int().min(0).max(10000).optional(),
  currentRevenue: z.string().trim().max(120).optional(),
  existingOnline: z.boolean().optional(),
  challenges: z.string().trim().max(3000).optional(),
  goals: z.string().trim().max(3000).optional(),
});

export const updatePartnerApplicationSchema = z
  .object({
    status: partnerApplicationStatusSchema.optional(),
    notes: z.string().trim().max(5000).optional(),
  })
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    { message: "Choose a review update" },
  );

export type PartnerApplicationStatus = z.infer<
  typeof partnerApplicationStatusSchema
>;
export type PartnerType = z.infer<typeof partnerTypeSchema>;
export type CreatePartnerApplicationFormData = z.infer<
  typeof createPartnerApplicationSchema
>;
export type UpdatePartnerApplicationFormData = z.infer<
  typeof updatePartnerApplicationSchema
>;
