import { z } from "zod";
import {
  PartnerApplicationStatusSchema,
  PartnerTypeSchema,
} from "../types/partner-application.type";

const OptionalText = (maximum: number) =>
  z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.string().trim().max(maximum).optional(),
  );

export const CreatePartnerApplicationDTO = z
  .object({
    businessName: z.string().trim().min(2).max(160),
    partnerType: PartnerTypeSchema,
    ownerName: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().min(7).max(40),
    address: OptionalText(300),
    website: z.preprocess(
      (value) => (value === "" || value === null ? undefined : value),
      z.string().trim().url("Enter a valid website URL").max(500).optional(),
    ),
    totalRooms: z.preprocess(
      (value) => (value === "" || value === null ? undefined : value),
      z.coerce.number().int().min(0).max(10000).optional(),
    ),
    currentRevenue: OptionalText(120),
    existingOnline: z.boolean().optional().default(false),
    challenges: OptionalText(3000),
    goals: OptionalText(3000),
  })
  .strict();

export type CreatePartnerApplicationDTO = z.infer<
  typeof CreatePartnerApplicationDTO
>;

export const AdminUpdatePartnerApplicationDTO = z
  .object({
    status: PartnerApplicationStatusSchema.optional(),
    notes: z.string().trim().max(5000).optional(),
  })
  .strict()
  .refine(
    (payload) => Object.values(payload).some((value) => value !== undefined),
    "At least one partner application field must be provided",
  );

export type AdminUpdatePartnerApplicationDTO = z.infer<
  typeof AdminUpdatePartnerApplicationDTO
>;

export const AdminPartnerApplicationListQueryDTO = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().optional(),
  status: PartnerApplicationStatusSchema.optional(),
  type: PartnerTypeSchema.optional(),
});

export type AdminPartnerApplicationListQueryDTO = z.infer<
  typeof AdminPartnerApplicationListQueryDTO
>;
