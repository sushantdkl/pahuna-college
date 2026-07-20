import { subscribeNewsletterApi } from "@/lib/api/newsletter-subscribers";
import type { NewsletterSubscriptionFormData } from "@/schemas/newsletter-subscriber.schema";

export function subscribeNewsletterAction(
  data: NewsletterSubscriptionFormData,
) {
  return subscribeNewsletterApi(data);
}
