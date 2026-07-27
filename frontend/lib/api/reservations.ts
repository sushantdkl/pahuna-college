import { apiGet, apiPatch, apiPost } from "./axios-instance";

export type RoomType = {
  _id: string;
  hotelId: string;
  name: string;
  description?: string;
  capacity: number;
  beds?: string;
  pricePerNight: number;
  totalRooms: number;
  amenities?: string[];
  images?: string[];
  active: boolean;
};

export type Reservation = {
  _id: string;
  hotelId: string | { _id: string; name: string; propertyType?: string; district?: string };
  roomTypeId: string | { _id: string; name: string; pricePerNight?: number; capacity?: number; beds?: string };
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  numberOfRooms: number;
  guestName: string;
  email: string;
  phone: string;
  specialRequests?: string;
  estimatedTotal: number;
  status: "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED" | "COMPLETED";
  createdAt: string;
};

export type ReservationInput = {
  hotelId: string;
  roomTypeId: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  numberOfRooms: number;
  guestName: string;
  email: string;
  phone: string;
  specialRequests?: string;
};

export function getRoomTypes(hotelId: string) {
  return apiGet<RoomType[]>(`/hotels/${hotelId}/room-types`);
}

export function createReservation(data: ReservationInput) {
  return apiPost<Reservation>("/reservations", data, true);
}

export function getMyReservations() {
  return apiGet<Reservation[]>("/reservations/me", true);
}

export function cancelReservation(id: string) {
  return apiPatch<Reservation>(`/reservations/${id}/cancel`, {}, true);
}
