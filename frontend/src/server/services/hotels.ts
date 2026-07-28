export function filterAndSortHotels<T extends Record<string, any>>(hotels: T[], filters?: Record<string, any>) {
  const query = String(filters?.query ?? "").toLowerCase();
  return hotels.filter((hotel) => !query || String(hotel.name ?? "").toLowerCase().includes(query));
}
