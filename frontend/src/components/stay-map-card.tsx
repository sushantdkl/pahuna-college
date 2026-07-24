import { TourismMap } from "@/components/tourism-map";

export function StayMapCard({
  lat,
  lng,
  name,
  address,
  stay,
}: {
  lat?: number;
  lng?: number;
  name?: string;
  address?: string;
  stay?: { name?: string; latitude?: number; longitude?: number; address?: string; location?: string };
}) {
  const markerName = name || stay?.name || "Stay location";
  const markerLat = lat ?? stay?.latitude;
  const markerLng = lng ?? stay?.longitude;
  const markerAddress = address || stay?.address || stay?.location;
  return (
    <TourismMap
      markers={typeof markerLat === "number" && typeof markerLng === "number" ? [{ id: markerName, title: markerName, description: markerAddress, lat: markerLat, lng: markerLng, category: "hotel" }] : []}
      heightClass="h-72"
    />
  );
}
