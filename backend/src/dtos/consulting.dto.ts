import { z } from "zod";
import { ConsultingLeadStatusSchema } from "../types/consulting.type";

const optionalText = (maximum: number) =>
  z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.string().trim().max(maximum).optional(),
  );

const stringList = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return value;
}, z.array(z.string().trim().min(1).max(160)).max(40));

const localImagePath = z
  .string()
  .trim()
  .max(500)
  .refine(
    (value) => value === "" || (value.startsWith("/") && !value.startsWith("//")),
    "Image must be a local public path",
  )
  .optional();

const serviceFields = z.object({
  title: z.string().trim().min(1, "Title is required").max(180),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must use lowercase words and hyphens")
    .max(220)
    .optional(),
  description: z.string().trim().min(1, "Description is required").max(10000),
  category: optionalText(100),
  price: optionalText(120),
  duration: optionalText(80),
  deliverables: stringList.default([]),
  image: localImagePath,
  isActive: z.boolean().default(true),
});

export const CreateConsultingServiceDTO = serviceFields;
export type CreateConsultingServiceDTO = z.infer<
  typeof CreateConsultingServiceDTO
>;

export const UpdateConsultingServiceDTO = serviceFields
  .partial()
  .refine(
    (payload) => Object.values(payload).some((value) => value !== undefined),
    "At least one consulting service field must be provided",
  );

export type UpdateConsultingServiceDTO = z.infer<
  typeof UpdateConsultingServiceDTO
>;

export const ConsultingServiceListQueryDTO = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(9),
  search: z.string().trim().optional(),
  category: z.string().trim().max(100).optional(),
});

export type ConsultingServiceListQueryDTO = z.infer<
  typeof ConsultingServiceListQueryDTO
>;

export const AdminConsultingServiceListQueryDTO =
  ConsultingServiceListQueryDTO.extend({
    limit: z.coerce.number().int().min(1).max(50).default(10),
    active: z
      .preprocess(
        (value) =>
          value === "" || value === undefined ? undefined : value === "true",
        z.boolean().optional(),
      )
      .optional(),
  });

export type AdminConsultingServiceListQueryDTO = z.infer<
  typeof AdminConsultingServiceListQueryDTO
>;

export const CreateConsultingLeadDTO = z
  .object({
    serviceId: optionalText(60),
    name: optionalText(120),
    contactName: optionalText(120),
    email: z.string().trim().email().max(254),
    phone: z.string().trim().min(7).max(40),
    businessName: optionalText(160),
    businessType: optionalText(120),
    businessStage: optionalText(120),
    stage: optionalText(120),
    businessSize: optionalText(120),
    location: optionalText(160),
    serviceType: optionalText(160),
    timeline: optionalText(120),
    budget: optionalText(120),
    budgetRange: optionalText(120),
    message: optionalText(5000),
  })
  .strict()
  .transform((payload) => ({
    ...payload,
    name: payload.name || payload.contactName || "",
    contactName: payload.contactName || payload.name || "",
    businessStage: payload.businessStage || payload.stage,
    stage: payload.stage || payload.businessStage,
    budget: payload.budget || payload.budgetRange,
    budgetRange: payload.budgetRange || payload.budget,
    message: payload.message || "",
  }))
  .refine((payload) => payload.name.length >= 2, "Contact person is required")
  .refine((payload) => payload.message.length >= 1, "Message is required");

export type CreateConsultingLeadDTO = z.infer<
  typeof CreateConsultingLeadDTO
>;

export const UpdateConsultingLeadDTO = z
  .object({
    status: ConsultingLeadStatusSchema.optional(),
    response: z.string().trim().max(5000).optional(),
    assignedTo: z.string().trim().optional(),
  })
  .strict()
  .refine(
    (payload) => Object.values(payload).some((value) => value !== undefined),
    "At least one consulting lead field must be provided",
  );

export type UpdateConsultingLeadDTO = z.infer<
  typeof UpdateConsultingLeadDTO
>;

export const AdminConsultingLeadListQueryDTO = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().optional(),
  status: ConsultingLeadStatusSchema.optional(),
  serviceId: z.string().trim().optional(),
});

export type AdminConsultingLeadListQueryDTO = z.infer<
  typeof AdminConsultingLeadListQueryDTO
>;
