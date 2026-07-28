import {
  createItinerary,
  deleteMyItinerary,
  getMyItineraries,
  getPlannerOptions,
  updateMyItinerary,
} from "@/lib/api/itineraries";

export const getPlannerOptionsAction = getPlannerOptions;
export const createItineraryAction = createItinerary;
export const getMyItinerariesAction = getMyItineraries;
export const updateMyItineraryAction = updateMyItinerary;
export const deleteMyItineraryAction = deleteMyItinerary;
