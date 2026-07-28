import { apiDelete, apiGet, apiPatch, apiPost, resolveApiAssetUrl } from "@/lib/api/axios-instance";

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

export type ListParams = {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean | "";
  featured?: boolean | "";
  type?: string;
  area?: string;
  district?: string;
  mode?: string;
  verificationStatus?: string;
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

function queryString(params: Record<string, unknown>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const value = query.toString();
  return value ? `?${value}` : "";
}

function normalizeFoodProvider(provider: FoodProvider): FoodProvider {
  return {
    ...provider,
    images: (provider.images || []).map((image) => resolveApiAssetUrl(image) || image),
  };
}

export async function getFoodProviders(params: ListParams = {}) {
  const response = await apiGet<FoodProvider[]>(`/food-providers${queryString(params)}`);
  return { ...response, data: response.data?.map(normalizeFoodProvider) || [] };
}

export async function getFoodProvider(slug: string) {
  const response = await apiGet<FoodProvider>(`/food-providers/${encodeURIComponent(slug)}`);
  return { ...response, data: response.data ? normalizeFoodProvider(response.data) : null };
}

export async function getAdminFoodProviders(params: ListParams = {}) {
  const response = await apiGet<FoodProvider[]>(`/admin/food-providers${queryString(params)}`, true);
  return { ...response, data: response.data?.map(normalizeFoodProvider) || [] };
}

function toFoodProviderFormData(
  payload: FoodProviderPayload,
  files?: FileList | File[] | null,
) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === "") return;

    if (Array.isArray(value)) {
      formData.set(key, JSON.stringify(value));
      return;
    }

    formData.set(key, String(value));
  });

  Array.from(files || []).forEach((file) => {
    formData.append("images", file);
  });

  return formData;
}

export function createAdminFoodProvider(
  payload: FoodProviderPayload,
  files?: FileList | File[] | null,
) {
  return apiPost<FoodProvider>(
    "/admin/food-providers",
    files?.length ? toFoodProviderFormData(payload, files) : payload,
    true,
  );
}

export function updateAdminFoodProvider(
  id: string,
  payload: FoodProviderPayload,
  files?: FileList | File[] | null,
) {
  return apiPatch<FoodProvider>(
    `/admin/food-providers/${id}`,
    files?.length ? toFoodProviderFormData(payload, files) : payload,
    true,
  );
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
