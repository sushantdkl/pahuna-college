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

function toPackageFormData(
  payload: Partial<AdminTripPackagePayload>,
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

export function createAdminTripPackage(
  payload: AdminTripPackagePayload,
  files?: FileList | File[] | null,
) {
  return apiPost<AdminTripPackage>(
    "/admin/trip-packages",
    files?.length ? toPackageFormData(payload, files) : payload,
    true,
  );
}

export function updateAdminTripPackage(
  id: string,
  payload: Partial<AdminTripPackagePayload>,
  files?: FileList | File[] | null,
) {
  return apiPatch<AdminTripPackage>(
    `/admin/trip-packages/${id}`,
    files?.length ? toPackageFormData(payload, files) : payload,
    true,
  );
}

export function deleteAdminTripPackage(id: string) {
  return apiDelete<{ deleted: true }>(`/admin/trip-packages/${id}`, true);
}
