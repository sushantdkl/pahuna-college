import { apiDelete, apiGet, apiPatch } from "./axios-instance";
import type { NewsletterSubscriber } from "./newsletter-subscribers";
import type { UpdateNewsletterSubscriberFormData } from "@/schemas/newsletter-subscriber.schema";

export type AdminNewsletterSubscriber = NewsletterSubscriber;

export type AdminNewsletterSubscriberListParams = {
  page: number;
  limit: number;
  search?: string;
  active?: boolean | "";
};

function toQueryString(params: AdminNewsletterSubscriberListParams) {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.search?.trim()) query.set("search", params.search.trim());
  if (params.active !== "" && params.active !== undefined) {
    query.set("active", String(params.active));
  }

  return query.toString();
}

export function getAdminNewsletterSubscribersApi(
  params: AdminNewsletterSubscriberListParams,
) {
  return apiGet<AdminNewsletterSubscriber[]>(
    `/admin/newsletter-subscribers?${toQueryString(params)}`,
    true,
  );
}

export function getAdminNewsletterSubscriberApi(id: string) {
  return apiGet<AdminNewsletterSubscriber>(
    `/admin/newsletter-subscribers/${id}`,
    true,
  );
}

export function updateAdminNewsletterSubscriberApi(
  id: string,
  data: UpdateNewsletterSubscriberFormData,
) {
  return apiPatch<AdminNewsletterSubscriber>(
    `/admin/newsletter-subscribers/${id}`,
    data,
    true,
  );
}

export function deleteAdminNewsletterSubscriberApi(id: string) {
  return apiDelete<{ deleted: boolean }>(
    `/admin/newsletter-subscribers/${id}`,
    true,
  );
}
