import type { HotelFilters } from "../lib/validations";

export function filterAndSortHotels<T>(hotels: T[], filters?: HotelFilters) {
  void filters;
  return hotels;
}
