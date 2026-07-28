import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api/axios-instance";
import type {
  ItineraryFormData,
  ItineraryStatus,
} from "@/schemas/itinerary.schema";

export type ItineraryReference = {
  _id: string;
  name: string;
  slug?: string;
  district?: string;
  category?: string;
  address?: string;
  location?: string;
  propertyType?: string;
  duration?: string;
  price?: number;
  priceMin?: number;
  priceMax?: number;
  images?: string[];
};

export type ItineraryUser = {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
};

export type Itinerary = {
  _id: string;
  userId: string | ItineraryUser;
  title: string;
  description?: string;
  destinationId: string | ItineraryReference;
  startDate?: string;
  endDate?: string;
  totalDays?: number;
  budget?: number;
  hotelIds: Array<string | ItineraryReference>;
  experienceIds: Array<string | ItineraryReference>;
  status: ItineraryStatus;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PlannerOptions = {
  destinations: ItineraryReference[];
  hotels: ItineraryReference[];
  experiences: ItineraryReference[];
};

export function getPlannerOptions() {
  return apiGet<PlannerOptions>("/itineraries/options");
}

export function createItinerary(payload: ItineraryFormData) {
  return apiPost<Itinerary>("/itineraries", payload, true);
}

export function getMyItineraries(page = 1, limit = 10) {
  return apiGet<Itinerary[]>(
    `/itineraries/my?page=${page}&limit=${limit}`,
    true,
  );
}

export function getMyItinerary(id: string) {
  return apiGet<Itinerary>(`/itineraries/${id}`, true);
}

export function updateMyItinerary(
  id: string,
  payload: Partial<ItineraryFormData>,
) {
  return apiPatch<Itinerary>(`/itineraries/${id}`, payload, true);
}

export function deleteMyItinerary(id: string) {
  return apiDelete<{ deleted: true }>(`/itineraries/${id}`, true);
}
