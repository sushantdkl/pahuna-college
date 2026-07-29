import { apiPost } from "./axios-instance";

export type CreatedNewsletterSubscriber = {
  _id: string;
  email: string;
  name?: string;
  isActive: boolean;
  subscribedAt: string;
  createdAt: string;
  updatedAt: string;
};

export function createNewsletterSubscriberApi(data: {
  email: string;
  name?: string;
}) {
  return apiPost<CreatedNewsletterSubscriber>("/newsletter-subscribers", data);
}
