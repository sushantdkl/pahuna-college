// @ts-nocheck
"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Building2, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HotelCard } from "./hotel-card";
import { HotelFilterBar } from "./hotel-filters";
import { MapModal } from "@/components/maps/map-modal";
import { MapPreviewCard } from "@/components/maps/map-preview-card";
import { hasVerifiedCoordinates } from "@/components/maps/provider-map";
import { filterAndSortHotels } from "@/lib/services/hotels";
import { EmptyState } from "@/components/shared/empty-state";
import { PRICE_RANGES, PROVIDER_TYPES } from "@/lib/constants";
import type { HotelFilters } from "@/lib/validations";

interface ExplorerHotel {
  id?: string;
  name: string;
  slug: string;
  shortDesc: string;
  propertyType: string;
  typeLabel?: string;
  district?: string | null;
  area?: string | null;
  address?: string | null;
  priceMin?: number | null;
  priceMax?: number | null;
  priceFrom?: number | null;
  currency?: string;
  starRating?: number | null;
  rating?: number | null;
  isVerified?: boolean;
  isFeatured?: boolean;
  verificationStatus?: string | null;
  consentStatus?: string | null;
  amenities: string[];
  services?: string[];
  images: string[];
  googleMapLink?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

interface HotelsExplorerProps {
  hotels: ExplorerHotel[];
}

export function HotelsExplorer({ hotels }: HotelsExplorerProps) {
  const [filters, setFilters] = useState<HotelFilters>({
    search: "",
    propertyType: null,
    district: null,
    priceRange: null,
    starRating: null,
    verificationStatus: null,
    amenities: [],
    location: "",
    sortBy: "featured",
  });

  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const filteredHotels = useMemo(
    () => filterAndSortHotels(hotels, filters),
    [hotels, filters],
  );

  const filterSummary = useMemo(() => {
    const parts: string[] = [];
    if (filters.district) parts.push(`District: ${filters.district}`);
    if (filters.propertyType) {
      const label =
        PROVIDER_TYPES.find((type) => type.value === filters.propertyType)?.label ??
        filters.propertyType.replace(/_/g, " ");
      parts.push(`Type: ${label}`);
    }
    if (filters.priceRange) {
      const label =
        PRICE_RANGES.find((range) => range.label === filters.priceRange)?.label ??
        filters.priceRange;
      parts.push(label);
    }
    if (filters.starRating) parts.push(`${filters.starRating}+ stars`);
    if (filters.sortBy) {
      const sortLabel: Record<HotelFilters["sortBy"], string> = {
        featured: "Featured first",
        "price-low": "Price: low to high",
        "price-high": "Price: high to low",
        rating: "Top rated",
      };
      parts.push(`Sort: ${sortLabel[filters.sortBy]}`);
    }
    return parts;
  }, [filters]);

  const openMapForHotel = (slug?: string) => {
    if (slug) setSelectedSlug(slug);
    setIsMapOpen(true);
  };

  return (
    <div>
      <HotelFilterBar
        filters={filters}
        onChange={setFilters}
        totalResults={filteredHotels.length}
        totalHotels={hotels.length}
      />

      <MapPreviewCard providers={filteredHotels} onOpen={() => openMapForHotel()} />

      <MapModal
        providers={filteredHotels}
        open={isMapOpen}
        onOpenChange={setIsMapOpen}
        selectedSlug={selectedSlug}
        onSelectProvider={setSelectedSlug}
      />

      <div className="mt-8 rounded-3xl border border-amber-100/70 bg-amber-50/30 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/70">
              Karnali stays and services
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">
              Showing {filteredHotels.length} stays & services
            </h2>
            <p className="text-sm text-muted-foreground">
              Public listings and verified providers across Surkhet and Karnali.
            </p>
            {filterSummary.length > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                {filterSummary.join(" Â· ")}
              </p>
            )}
          </div>
          <Button variant="outline" onClick={() => openMapForHotel()}>
            Open Map
          </Button>
        </div>

        {filteredHotels.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredHotels.map((hotel) => (
              <div
                key={hotel.slug}
                ref={(el) => {
                  cardRefs.current[hotel.slug] = el;
                }}
                onMouseEnter={() => setSelectedSlug(hotel.slug)}
                onMouseLeave={() => setSelectedSlug(null)}
              >
                <HotelCard
                  name={hotel.name}
                  slug={hotel.slug}
                  shortDesc={hotel.shortDesc}
                  propertyType={hotel.propertyType}
                  typeLabel={hotel.typeLabel}
                  district={hotel.district}
                  area={hotel.area}
                  address={hotel.address}
                  priceMin={hotel.priceMin}
                  priceMax={hotel.priceMax}
                  priceFrom={hotel.priceFrom}
                  currency={hotel.currency}
                  starRating={hotel.starRating}
                  rating={hotel.rating}
                  isVerified={hotel.isVerified}
                  isFeatured={hotel.isFeatured}
                  verificationStatus={hotel.verificationStatus}
                  consentStatus={hotel.consentStatus}
                  amenities={hotel.amenities}
                  services={hotel.services}
                  coverImage={hotel.images?.[0]}
                  googleMapLink={hotel.googleMapLink}
                  isActive={selectedSlug === hotel.slug}
                  hasMapLocation={hasVerifiedCoordinates(hotel)}
                  onViewMap={() => openMapForHotel(hotel.slug)}
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Compass className="h-14 w-14" />}
            title="No stays or services found"
            description="Try changing your filters or search another district in Karnali."
            action={{ label: "Clear filters", href: "/hotels" }}
          />
        )}

        <Card className="mt-8 border-dashed border-primary/30 bg-primary/5">
          <CardContent className="flex flex-col items-center gap-6 p-6 sm:flex-row">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Building2 className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="mb-1 font-semibold">
                Own or manage a Karnali tourism service?
              </h3>
              <p className="text-sm text-muted-foreground">
                List your stay, transport, tour, guide, or adventure service and help travelers plan with local confidence.
              </p>
            </div>
            <Button asChild>
              <Link href="/partner/hotels">
                List Your Service <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
