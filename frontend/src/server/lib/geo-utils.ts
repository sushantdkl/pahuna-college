type Point = { latitude?: number | null; longitude?: number | null; lat?: number | null; lng?: number | null };

const coord = (point: Point) => ({ lat: Number(point.latitude ?? point.lat ?? 0), lng: Number(point.longitude ?? point.lng ?? 0) });

export function distanceKm(latitudeA: number, longitudeA: number, latitudeB: number, longitudeB: number): number;
export function distanceKm(a: Point, b: Point): number;
export function distanceKm(aOrLat: Point | number, bOrLng: Point | number, maybeLat?: number, maybeLng?: number) {
  const a = typeof aOrLat === "number" ? { latitude: aOrLat, longitude: Number(bOrLng) } : aOrLat;
  const b = typeof aOrLat === "number" ? { latitude: Number(maybeLat), longitude: Number(maybeLng) } : (bOrLng as Point);
  const start = coord(a);
  const end = coord(b);
  const radius = 6371;
  const dLat = ((end.lat - start.lat) * Math.PI) / 180;
  const dLng = ((end.lng - start.lng) * Math.PI) / 180;
  const lat1 = (start.lat * Math.PI) / 180;
  const lat2 = (end.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return Math.round(radius * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)) * 10) / 10;
}

export function findNearbyPlaces<T extends Point>(origin: Point, places: T[], maxKm?: number): Array<T & { distanceKm: number }>;
export function findNearbyPlaces<T extends Point>(latitude: number, longitude: number, places: T[], maxKm?: number): Array<T & { distanceKm: number }>;
export function findNearbyPlaces<T extends Point>(originOrLat: Point | number, placesOrLng: T[] | number, maybePlaces?: T[] | number, maybeMaxKm = 25) {
  const origin = typeof originOrLat === "number" ? { latitude: originOrLat, longitude: Number(placesOrLng) } : originOrLat;
  const places = (Array.isArray(placesOrLng) ? placesOrLng : maybePlaces) as T[];
  const maxKm = typeof maybePlaces === "number" ? maybePlaces : maybeMaxKm;
  return places.map((place) => ({ ...place, distanceKm: distanceKm(origin, place) })).filter((place) => place.distanceKm <= maxKm);
}
