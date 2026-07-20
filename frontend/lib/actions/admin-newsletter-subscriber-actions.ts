import {
  deleteAdminNewsletterSubscriberApi,
  getAdminNewsletterSubscriberApi,
  getAdminNewsletterSubscribersApi,
  updateAdminNewsletterSubscriberApi,
  type AdminNewsletterSubscriberListParams,
} from "@/lib/api/admin-newsletter-subscribers";
import type { UpdateNewsletterSubscriberFormData } from "@/schemas/newsletter-subscriber.schema";

export function getAdminNewsletterSubscribersAction(
  params: AdminNewsletterSubscriberListParams,
) {
  return getAdminNewsletterSubscribersApi(params);
}

export function getAdminNewsletterSubscriberAction(id: string) {
  return getAdminNewsletterSubscriberApi(id);
}

export function updateAdminNewsletterSubscriberAction(
  id: string,
  data: UpdateNewsletterSubscriberFormData,
) {
  return updateAdminNewsletterSubscriberApi(id, data);
}

export function deleteAdminNewsletterSubscriberAction(id: string) {
  return deleteAdminNewsletterSubscriberApi(id);
}
