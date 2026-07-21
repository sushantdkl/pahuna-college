import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api/axios-instance";
import type {
  AdminTripPackagePayload,
  TripPackage,
  TripPackageListParams,
} from "@/lib/api/trip-packages";

export type AdminTripPackage = TripPackage;

export type AdminTripPackageListParams = TripPackageListParams & {
  active?: boolean | "";
};

function queryString(params: Record<string, unknown>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const value = query.toString();
  return value ? `?${value}` : "";
}

export function getAdminTripPackages(params: AdminTripPackageListParams = {}) {
  return apiGet<AdminTripPackage[]>(
    `/admin/trip-packages${queryString(params)}`,
    true,
  );
}

export function createAdminTripPackage(payload: AdminTripPackagePayload) {
  return apiPost<AdminTripPackage>("/admin/trip-packages", payload, true);
}

export function updateAdminTripPackage(id: string, payload: Partial<AdminTripPackagePayload>) {
  return apiPatch<AdminTripPackage>(`/admin/trip-packages/${id}`, payload, true);
}

export function deleteAdminTripPackage(id: string) {
  return apiDelete<{ deleted: true }>(`/admin/trip-packages/${id}`, true);
}
