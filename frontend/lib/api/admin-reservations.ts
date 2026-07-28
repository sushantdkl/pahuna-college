import { apiGet, apiPatch } from "./axios-instance";
import type { Reservation } from "./reservations";

export type AdminReservationListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  hotelId?: string;
};

function query(params: AdminReservationListParams = {}) {
  const searchParams = new URLSearchParams({
    page: String(params.page || 1),
    limit: String(params.limit || 10),
  });
  if (params.search) searchParams.set("search", params.search);
  if (params.status) searchParams.set("status", params.status);
  if (params.hotelId) searchParams.set("hotelId", params.hotelId);
  return searchParams.toString();
}

export function getAdminReservations(params?: AdminReservationListParams) {
  return apiGet<Reservation[]>(`/admin/reservations?${query(params)}`, true);
}

export function updateAdminReservation(id: string, data: { status?: string; internalNotes?: string }) {
  return apiPatch<Reservation>(`/admin/reservations/${id}`, data, true);
}
