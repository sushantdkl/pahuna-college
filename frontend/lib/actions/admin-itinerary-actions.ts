import {
  createAdminItinerary,
  deleteAdminItinerary,
  getAdminItineraries,
  getAdminItinerary,
  updateAdminItinerary,
} from "@/lib/api/admin-itineraries";

export const getAdminItinerariesAction = getAdminItineraries;
export const getAdminItineraryAction = getAdminItinerary;
export const createAdminItineraryAction = createAdminItinerary;
export const updateAdminItineraryAction = updateAdminItinerary;
export const deleteAdminItineraryAction = deleteAdminItinerary;
