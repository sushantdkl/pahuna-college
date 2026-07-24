import type { HotelFilters } from "../validations";

export function filterAndSortHotels<T>(hotels: T[], filters?: HotelFilters) {
  void filters;
  return hotels;
}
