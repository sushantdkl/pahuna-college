// @ts-nocheck
"use client";

import Link from "next/link";
import { AlertCircle, ExternalLink, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProviderMap, hasVerifiedCoordinates, type MapProvider } from "./provider-map";

interface MapModalProps {
  providers: MapProvider[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSlug: string | null;
  onSelectProvider: (slug: string | null) => void;
}

export function MapModal({
  providers,
  open,
  onOpenChange,
  selectedSlug,
  onSelectProvider,
}: MapModalProps) {
  const selectedProvider = selectedSlug
    ? providers.find((provider) => provider.slug === selectedSlug)
    : null;
  const selectedHasCoordinates = selectedProvider
    ? hasVerifiedCoordinates(selectedProvider)
    : false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[92vh] max-w-[calc(100%-1rem)] gap-3 overflow-hidden rounded-3xl border-amber-100 bg-amber-50/80 p-3 sm:h-[86vh] sm:max-w-6xl sm:p-4">
        <DialogHeader className="sr-only">
          <DialogTitle>Karnali Map Explorer</DialogTitle>
          <DialogDescription>
            Explore active stay and service providers with map coordinates and Google Maps links.
          </DialogDescription>
        </DialogHeader>

        <div className="relative h-full min-h-0 overflow-hidden rounded-3xl bg-white">
          {open && (
            <ProviderMap
              providers={providers}
              selectedSlug={selectedHasCoordinates ? selectedSlug : null}
              onSelectProvider={onSelectProvider}
              className="h-full"
            />
          )}

          {selectedProvider && (
            <div className="absolute bottom-4 left-4 right-4 z-[500] rounded-2xl border border-white/80 bg-white/95 p-4 shadow-xl backdrop-blur md:left-auto md:w-[360px]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/80">
                    Selected provider
                  </p>
                  <h3 className="mt-1 text-base font-semibold">{selectedProvider.name}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {[selectedProvider.area, selectedProvider.district].filter(Boolean).join(" · ") || "Karnali Province"}
                  </p>
                  {!selectedHasCoordinates && (
                    <p className="mt-2 flex items-start gap-1.5 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-900">
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      Coordinates for this public listing are pending verification.
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/hotels/${selectedProvider.slug}`}>View</Link>
                  </Button>
                  {selectedProvider.googleMapLink && (
                    <Button asChild size="sm" variant="outline">
                      <a href={selectedProvider.googleMapLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        Maps
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
