import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api/axios-instance";

export type FoodProvider = {
  _id: string;
  name: string;
  slug: string;
  type: string;
  district: string;
  municipality?: string;
  area: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  shortDescription: string;
  longDescription?: string;
  cuisines: string[];
  services: string[];
  features: string[];
  priceLevel?: string;
  openingHours?: string;
  phone?: string;
  email?: string;
  website?: string;
  images: string[];
  rating?: number;
  reviewCount?: number;
  verificationStatus: "PENDING" | "VERIFIED" | "PARTNER" | "REJECTED";
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TransportRoute = {
  _id: string;
  fromLocation: string;
  toLocation: string;
  mode: string;
  durationHours?: number;
  costMin?: number;
  costMax?: number;
  frequency?: string;
  notes?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type RouteSegment = {
  _id: string;
  from: string;
  to: string;
  slug: string;
  mode: "FLIGHT" | "BUS" | "JEEP" | "WALK" | "TREK" | "MIXED";
  distanceKm?: number;
  durationMin?: number;
  durationMax?: number;
  costMin?: number;
  costMax?: number;
  currency: string;
  seasonality?: string;
  reliability: "HIGH" | "MEDIUM" | "LOW";
  notes?: string;
  riskNotes?: string;
  recommendedStopover?: string;
  requiresConfirmation: boolean;
  active: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type FAQ = {
  _id: string;
  question: string;
  answer: string;
  category: string;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type Testimonial = {
  _id: string;
  name: string;
  role?: string;
  company?: string;
  quote: string;
  rating: number;
  avatar?: string;
  category?: string;
  serviceSlug?: string;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ListParams = {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean | "";
  featured?: boolean | "";
  published?: boolean | "";
  category?: string;
  type?: string;
  area?: string;
  district?: string;
  mode?: string;
  verificationStatus?: string;
  serviceSlug?: string;
};

export type FoodProviderPayload = Omit<Partial<FoodProvider>, "_id" | "createdAt" | "updatedAt"> & {
  name?: string;
  type?: string;
  district?: string;
  area?: string;
  shortDescription?: string;
};

export type TransportRoutePayload = Omit<Partial<TransportRoute>, "_id" | "createdAt" | "updatedAt">;
export type RouteSegmentPayload = Omit<Partial<RouteSegment>, "_id" | "createdAt" | "updatedAt">;
export type FAQPayload = Omit<Partial<FAQ>, "_id" | "createdAt" | "updatedAt">;
export type TestimonialPayload = Omit<Partial<Testimonial>, "_id" | "createdAt" | "updatedAt">;

function queryString(params: Record<string, unknown>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const value = query.toString();
  return value ? `?${value}` : "";
}

export function getFoodProviders(params: ListParams = {}) {
  return apiGet<FoodProvider[]>(`/food-providers${queryString(params)}`);
}

export function getFoodProvider(slug: string) {
  return apiGet<FoodProvider>(`/food-providers/${encodeURIComponent(slug)}`);
}

export function getAdminFoodProviders(params: ListParams = {}) {
  return apiGet<FoodProvider[]>(`/admin/food-providers${queryString(params)}`, true);
}

export function createAdminFoodProvider(payload: FoodProviderPayload) {
  return apiPost<FoodProvider>("/admin/food-providers", payload, true);
}

export function updateAdminFoodProvider(id: string, payload: FoodProviderPayload) {
  return apiPatch<FoodProvider>(`/admin/food-providers/${id}`, payload, true);
}

export function deleteAdminFoodProvider(id: string) {
  return apiDelete<{ deleted: true }>(`/admin/food-providers/${id}`, true);
}

export function getTransportRoutes(params: ListParams = {}) {
  return apiGet<TransportRoute[]>(`/transport-routes${queryString(params)}`);
}

export function getRouteSegments(params: ListParams = {}) {
  return apiGet<RouteSegment[]>(`/route-segments${queryString(params)}`);
}

export function getAdminTransportRoutes(params: ListParams = {}) {
  return apiGet<TransportRoute[]>(`/admin/transport-routes${queryString(params)}`, true);
}

export function createAdminTransportRoute(payload: TransportRoutePayload) {
  return apiPost<TransportRoute>("/admin/transport-routes", payload, true);
}

export function updateAdminTransportRoute(id: string, payload: TransportRoutePayload) {
  return apiPatch<TransportRoute>(`/admin/transport-routes/${id}`, payload, true);
}

export function deleteAdminTransportRoute(id: string) {
  return apiDelete<{ deleted: true }>(`/admin/transport-routes/${id}`, true);
}

export function getAdminRouteSegments(params: ListParams = {}) {
  return apiGet<RouteSegment[]>(`/admin/route-segments${queryString(params)}`, true);
}

export function createAdminRouteSegment(payload: RouteSegmentPayload) {
  return apiPost<RouteSegment>("/admin/route-segments", payload, true);
}

export function updateAdminRouteSegment(id: string, payload: RouteSegmentPayload) {
  return apiPatch<RouteSegment>(`/admin/route-segments/${id}`, payload, true);
}

export function deleteAdminRouteSegment(id: string) {
  return apiDelete<{ deleted: true }>(`/admin/route-segments/${id}`, true);
}

export function getFAQs(params: ListParams = {}) {
  return apiGet<FAQ[]>(`/faqs${queryString(params)}`);
}

export function getAdminFAQs(params: ListParams = {}) {
  return apiGet<FAQ[]>(`/admin/faqs${queryString(params)}`, true);
}

export function createAdminFAQ(payload: FAQPayload) {
  return apiPost<FAQ>("/admin/faqs", payload, true);
}

export function updateAdminFAQ(id: string, payload: FAQPayload) {
  return apiPatch<FAQ>(`/admin/faqs/${id}`, payload, true);
}

export function deleteAdminFAQ(id: string) {
  return apiDelete<{ deleted: true }>(`/admin/faqs/${id}`, true);
}

export function getTestimonials(params: ListParams = {}) {
  return apiGet<Testimonial[]>(`/testimonials${queryString(params)}`);
}

export function getAdminTestimonials(params: ListParams = {}) {
  return apiGet<Testimonial[]>(`/admin/testimonials${queryString(params)}`, true);
}

export function createAdminTestimonial(payload: TestimonialPayload) {
  return apiPost<Testimonial>("/admin/testimonials", payload, true);
}

export function updateAdminTestimonial(id: string, payload: TestimonialPayload) {
  return apiPatch<Testimonial>(`/admin/testimonials/${id}`, payload, true);
}

export function deleteAdminTestimonial(id: string) {
  return apiDelete<{ deleted: true }>(`/admin/testimonials/${id}`, true);
}
