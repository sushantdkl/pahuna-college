"use client";

import { GoogleMapsProvider } from "./google-maps-provider";
import { PahunaMap } from "./pahuna-map";
import { PahunaMarker } from "./pahuna-marker";
import { PahunaDirections } from "./pahuna-directions";
import { ZOOM } from "./map-constants";

interface HotelMapSectionProps {
  lat: number;
  lng: number;
  name: string;
  address?: string;
}

/**
 * Hotel detail page map — single marker with "Get Directions" button.
 */
export function HotelMapSection({ lat, lng, name, address }: HotelMapSectionProps) {
  const position = { lat, lng };

  return (
    <GoogleMapsProvider>
      <div className="space-y-3">
        <PahunaMap
          center={position}
          zoom={ZOOM.detail}
          className="w-full h-[250px] md:h-[300px] rounded-xl overflow-hidden"
          fallbackLabel={address ?? name}
        >
          <PahunaMarker position={position} title={name} category="hotel">
            <div className="p-2">
              <p className="font-semibold text-sm">{name}</p>
              {address && <p className="text-xs text-slate-500">{address}</p>}
            </div>
          </PahunaMarker>
        </PahunaMap>
        <PahunaDirections lat={lat} lng={lng} />
      </div>
    </GoogleMapsProvider>
  );
}


