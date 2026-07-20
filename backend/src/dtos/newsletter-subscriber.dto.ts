import { z } from "zod";
import { NewsletterSubscriberSchema } from "../types/newsletter-subscriber.type";

export const CreateNewsletterSubscriberDTO = NewsletterSubscriberSchema.pick({
  email: true,
  name: true,
}).strict();

export type CreateNewsletterSubscriberDTO = z.infer<
  typeof CreateNewsletterSubscriberDTO
>;

export const AdminUpdateNewsletterSubscriberDTO = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    isActive: z.boolean().optional(),
  })
  .strict()
  .refine(
    (payload) => Object.values(payload).some((value) => value !== undefined),
    "At least one newsletter subscriber field must be provided",
  );

export type AdminUpdateNewsletterSubscriberDTO = z.infer<
  typeof AdminUpdateNewsletterSubscriberDTO
>;

const ActiveFilterSchema = z
  .enum(["true", "false"])
  .transform((value) => value === "true")
  .optional();

export const AdminNewsletterSubscriberListQueryDTO = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().optional(),
  active: ActiveFilterSchema,
});

export type AdminNewsletterSubscriberListQueryDTO = z.infer<
  typeof AdminNewsletterSubscriberListQueryDTO
>;
