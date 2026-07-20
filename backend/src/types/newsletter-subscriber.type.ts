import { z } from "zod";

export const NewsletterSubscriberSchema = z.object({
  email: z.string().trim().email().max(254),
  name: z.string().trim().min(1).max(120).optional(),
  isActive: z.boolean().default(true),
  subscribedAt: z.date().optional(),
  unsubscribedAt: z.date().nullable().optional(),
});

export type NewsletterSubscriberType = z.infer<
  typeof NewsletterSubscriberSchema
>;
