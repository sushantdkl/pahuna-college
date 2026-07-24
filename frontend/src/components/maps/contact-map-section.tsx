// @ts-nocheck
"use client";

import { MapPin, Phone, Mail, Clock, Navigation } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@backend/lib/constants";
import { GoogleMapsProvider } from "./google-maps-provider";
import { PahunaMap } from "./pahuna-map";
import { PahunaMarker } from "./pahuna-marker";
import { PahunaDirections } from "./pahuna-directions";
import { SURKHET_CENTER, ZOOM } from "./map-constants";

const OFFICE_POSITION = SURKHET_CENTER;

const contactDetails = [
  { icon: MapPin, label: "Address", value: SITE_CONFIG.address },
  { icon: Phone, label: "Phone", value: SITE_CONFIG.phone },
  { icon: Mail, label: "Email", value: SITE_CONFIG.email },
  { icon: Clock, label: "Hours", value: "Sun – Fri: 9 AM – 6 PM (NPT)" },
] as const;

/**
 * Contact page map — shows Pahuna office location with address details
 * and OpenStreetMap directions. Uses the shared Pahuna map system.
 */
export function ContactMapSection() {
  const mapsUrl = `https://www.openstreetmap.org/?mlat=${OFFICE_POSITION.lat}&mlon=${OFFICE_POSITION.lng}#map=16/${OFFICE_POSITION.lat}/${OFFICE_POSITION.lng}`;

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* ── Map ── */}
      <div className="lg:col-span-2">
        <GoogleMapsProvider>
          <PahunaMap
            center={OFFICE_POSITION}
            zoom={ZOOM.detail}
            className="w-full h-[300px] md:h-[420px] rounded-2xl overflow-hidden"
            fallbackLabel="Birendranagar, Surkhet — Karnali Province, Nepal"
          >
            <PahunaMarker
              position={OFFICE_POSITION}
              title="Pahuna — Birendranagar"
              category="office"
            >
              <div className="p-2 max-w-[220px]">
                <p className="font-semibold text-sm">Pahuna</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {SITE_CONFIG.address}
                </p>
                <div className="mt-2">
                  <PahunaDirections
                    lat={OFFICE_POSITION.lat}
                    lng={OFFICE_POSITION.lng}
                    label="Directions"
                  />
                </div>
              </div>
            </PahunaMarker>
          </PahunaMap>
        </GoogleMapsProvider>
      </div>

      {/* ── Contact Details Panel ── */}
      <Card className="border shadow-sm h-fit">
        <CardContent className="p-6 space-y-5">
          <div>
            <h3 className="text-lg font-semibold">Find Us</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Pahuna Tourism Office, Birendranagar
            </p>
          </div>

          <div className="space-y-4">
            {contactDetails.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/8">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {label}
                  </p>
                  <p className="text-sm font-medium mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Button asChild className="w-full">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Open in OpenStreetMap
              </a>
            </Button>
            <PahunaDirections
              lat={OFFICE_POSITION.lat}
              lng={OFFICE_POSITION.lng}
              label="Get Directions"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


