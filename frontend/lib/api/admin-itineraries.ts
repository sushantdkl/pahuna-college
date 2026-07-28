import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api/axios-instance";
import type { Itinerary } from "@/lib/api/itineraries";
import type {
  ItineraryFormData,
  ItineraryStatus,
} from "@/schemas/itinerary.schema";

export type AdminItinerary = Itinerary;

export type AdminItineraryListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: ItineraryStatus | "";
  isPublic?: boolean | "";
  destinationId?: string;
  userId?: string;
};

export type AdminItineraryCreateData = ItineraryFormData & {
  userId: string;
};

function queryString(params: AdminItineraryListParams) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  const value = query.toString();
  return value ? `?${value}` : "";
}

export function getAdminItineraries(params: AdminItineraryListParams = {}) {
  return apiGet<AdminItinerary[]>(
    `/admin/itineraries${queryString(params)}`,
    true,
  );
}

export function getAdminItinerary(id: string) {
  return apiGet<AdminItinerary>(`/admin/itineraries/${id}`, true);
}

export function createAdminItinerary(payload: AdminItineraryCreateData) {
  return apiPost<AdminItinerary>("/admin/itineraries", payload, true);
}

export function updateAdminItinerary(
  id: string,
  payload: Partial<ItineraryFormData>,
) {
  return apiPatch<AdminItinerary>(`/admin/itineraries/${id}`, payload, true);
}

export function deleteAdminItinerary(id: string) {
  return apiDelete<{ deleted: true }>(`/admin/itineraries/${id}`, true);
}
