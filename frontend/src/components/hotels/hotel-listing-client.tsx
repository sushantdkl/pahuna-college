// @ts-nocheck
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Hotel, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HotelCard } from "@/components/hotels/hotel-card";
import { HotelFilterBar } from "@/components/hotels/hotel-filters";
import { filterAndSortHotels } from "@/lib/services/hotels";
import { EmptyState } from "@/components/shared/empty-state";
import type { HotelFilters } from "@/lib/validations";

interface HotelListingClientProps {
  hotels: Array<{
    name: string;
    slug: string;
    shortDesc: string;
    propertyType: string;
    address: string;
    priceMin: number;
    priceMax: number;
    starRating: number;
    isVerified: boolean;
    isFeatured: boolean;
    amenities: string[];
    images: string[];
  }>;
  adminPreview?: boolean;
}

export function HotelListingClient({ hotels, adminPreview = false }: HotelListingClientProps) {
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

  const filteredHotels = useMemo(
    () => filterAndSortHotels(hotels, filters),
    [hotels, filters]
  );

  return (
    <>
      {/* Filters */}
      <HotelFilterBar
        filters={filters}
        onChange={setFilters}
        totalResults={filteredHotels.length}
        totalHotels={hotels.length}
      />

      {/* Results Grid */}
      <div className="mt-8">
        {filteredHotels.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map((hotel) => (
              <HotelCard
                key={hotel.slug}
                name={hotel.name}
                slug={hotel.slug}
                shortDesc={hotel.shortDesc}
                propertyType={hotel.propertyType}
                address={hotel.address}
                priceMin={hotel.priceMin}
                priceMax={hotel.priceMax}
                starRating={hotel.starRating}
                isVerified={hotel.isVerified}
                isFeatured={hotel.isFeatured}
                amenities={hotel.amenities}
                coverImage={hotel.images?.[0]}
                adminPreview={adminPreview}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Hotel className="h-14 w-14" />}
            title="No stays or services match your filters"
            description="Try changing your filters or search another district in Karnali."
            action={{ label: "View All", href: "/hotels" }}
          />
        )}
      </div>

      {/* -- List Your Hotel CTA (inline) -- */}
      <Card className="mt-12 border-dashed border-primary/30 bg-primary/5">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Building2 className="h-7 w-7 text-primary" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-semibold mb-1">
              Own or manage a Karnali tourism service?
            </h3>
            <p className="text-sm text-muted-foreground">
              List your stay, transport, tour, guide, or adventure service and reach travelers planning Karnali routes.
            </p>
          </div>
          <Button asChild>
            <Link href="/partner/hotels">
              List Your Service <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </>
  );
}


