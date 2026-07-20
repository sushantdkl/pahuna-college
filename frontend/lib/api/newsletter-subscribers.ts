import { apiPost } from "./axios-instance";
import type { NewsletterSubscriptionFormData } from "@/schemas/newsletter-subscriber.schema";

export type NewsletterSubscriber = {
  _id: string;
  email: string;
  name?: string;
  isActive: boolean;
  subscribedAt: string;
  unsubscribedAt?: string | null;
};

export function subscribeNewsletterApi(data: NewsletterSubscriptionFormData) {
  return apiPost<NewsletterSubscriber>("/newsletter", data);
}
