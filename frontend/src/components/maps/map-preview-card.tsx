// @ts-nocheck
"use client";

import { AlertCircle, Map, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hasMapLocation, hasVerifiedCoordinates, type MapProvider } from "./provider-map";

interface MapPreviewCardProps {
  providers: MapProvider[];
  onOpen: () => void;
}

export function MapPreviewCard({ providers, onOpen }: MapPreviewCardProps) {
  const coordinateCount = providers.filter(hasVerifiedCoordinates).length;
  const googleMapLinkCount = providers.filter((provider) => provider.googleMapLink?.trim()).length;
  const mapLocationCount = providers.filter(hasMapLocation).length;
  const pendingCoordinatesCount = providers.length - coordinateCount;

  return (
    <section className="mt-6 overflow-hidden rounded-3xl border border-amber-100/80 bg-linear-to-br from-amber-50 via-white to-emerald-50/80 shadow-[0_14px_45px_rgba(15,23,42,0.08)]">
      <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_360px] lg:items-center">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Map className="h-3.5 w-3.5" />
            Map Preview
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Explore stays on map</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            View nearby stays, services, and attractions around Karnali without squeezing the listing cards.
          </p>

          <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-2xl bg-white/80 p-3 shadow-sm">
              <p className="text-xl font-bold text-primary">{providers.length}</p>
              <p className="text-xs text-muted-foreground">stays & services</p>
            </div>
            <div className="rounded-2xl bg-white/80 p-3 shadow-sm">
              <p className="text-xl font-bold text-primary">{mapLocationCount}</p>
              <p className="text-xs text-muted-foreground">with map location</p>
            </div>
            <div className="rounded-2xl bg-white/80 p-3 shadow-sm">
              <p className="text-xl font-bold text-primary">{pendingCoordinatesCount}</p>
              <p className="text-xs text-muted-foreground">pending coordinates</p>
            </div>
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            {coordinateCount} with map coordinates | {googleMapLinkCount} with Google Maps links
          </p>

          <Button className="mt-5" onClick={onOpen}>
            Open Map
          </Button>
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="group relative h-[220px] overflow-hidden rounded-3xl border border-emerald-100 bg-[#eef6e8] text-left shadow-inner transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/25"
          aria-label="Open stays map"
        >
          <div className="absolute inset-0 opacity-80">
            <div className="absolute left-8 top-8 h-24 w-40 rounded-full bg-emerald-200/60 blur-2xl" />
            <div className="absolute bottom-6 right-8 h-28 w-36 rounded-full bg-amber-200/70 blur-2xl" />
            <div className="absolute left-[-12%] top-[58%] h-20 w-[130%] -rotate-6 rounded-full border-[18px] border-white/70" />
            <div className="absolute left-[-20%] top-[22%] h-20 w-[120%] rotate-12 rounded-full border-[14px] border-emerald-700/10" />
          </div>
          {[
            "left-[22%] top-[34%]",
            "left-[48%] top-[48%]",
            "left-[70%] top-[30%]",
          ].map((position, index) => (
            <span
              key={position}
              className={`absolute ${position} flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-lg transition group-hover:scale-110`}
              style={{ transitionDelay: `${index * 40}ms` }}
            >
              <MapPin className="h-5 w-5" />
            </span>
          ))}
          <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/90 p-3 shadow-sm backdrop-blur">
            <p className="text-sm font-semibold">Open full map explorer</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <AlertCircle className="h-3 w-3" />
              Markers show only listings with coordinates
            </p>
          </div>
        </button>
      </div>
    </section>
  );
}
