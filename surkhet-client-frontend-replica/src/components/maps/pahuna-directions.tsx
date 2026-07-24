"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PahunaDirectionsProps {
  lat: number;
  lng: number;
  label?: string;
}

/**
 * "Get Directions" button that opens the location in OpenStreetMap
 * so users can start navigation from there.
 */
export function PahunaDirections({ lat, lng, label = "Get Directions" }: PahunaDirectionsProps) {
  const url = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`;

  return (
    <Button variant="outline" size="sm" asChild>
      <a href={url} target="_blank" rel="noopener noreferrer">
        <ExternalLink className="mr-2 h-4 w-4" />
        {label}
      </a>
    </Button>
  );
}


