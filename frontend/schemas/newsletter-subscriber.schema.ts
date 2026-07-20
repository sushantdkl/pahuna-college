import { z } from "zod";

export const newsletterSubscriptionSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(254),
  name: z.string().trim().min(1).max(120).optional(),
});

export const updateNewsletterSubscriberSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    isActive: z.boolean().optional(),
  })
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    { message: "Choose a subscriber update" },
  );

export type NewsletterSubscriptionFormData = z.infer<
  typeof newsletterSubscriptionSchema
>;
export type UpdateNewsletterSubscriberFormData = z.infer<
  typeof updateNewsletterSubscriberSchema
>;
