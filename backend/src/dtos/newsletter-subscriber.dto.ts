import { z } from "zod";

export const CreateNewsletterSubscriberDTO = z.object({
  email: z.string().trim().email("Enter a valid email address").max(254),
  name: z.string().trim().min(1).max(120).optional(),
});

export type CreateNewsletterSubscriberDTO = z.infer<
  typeof CreateNewsletterSubscriberDTO
>;
