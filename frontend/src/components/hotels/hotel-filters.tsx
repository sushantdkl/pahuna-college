// @ts-nocheck
"use client";

import { useCallback, useMemo, useState } from "react";
import { MapPin, Search, SlidersHorizontal, Star, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  KARNALI_DISTRICTS,
  PRICE_RANGES,
  PROVIDER_TYPES,
  STAR_RATINGS,
} from "@backend/lib/constants";
import type { HotelFilters } from "@backend/lib/validations";

const AMENITY_OPTIONS = [
  "Accommodation",
  "Restaurant",
  "WiFi",
  "Parking",
  "Tour packages",
  "Travel planning",
  "Ticketing",
  "Rafting",
  "Jeep rental",
  "Regional transport",
  "Local guiding",
  "Room Service",
  "AC",
  "Hot Water",
  "Garden",
  "Travel Desk",
  "Conference Hall",
];

interface HotelFilterBarProps {
  filters: HotelFilters;
  onChange: (filters: HotelFilters) => void;
  totalResults: number;
  totalHotels: number;
}

export function HotelFilterBar({
  filters,
  onChange,
  totalResults,
  totalHotels,
}: HotelFilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.propertyType) count++;
    if (filters.district) count++;
    if (filters.priceRange) count++;
    if (filters.starRating) count++;
    if (filters.verificationStatus) count++;
    if (filters.amenities.length > 0) count += filters.amenities.length;
    if (filters.location) count++;
    return count;
  }, [filters]);

  const updateFilter = useCallback(
    <K extends keyof HotelFilters>(key: K, value: HotelFilters[K]) => {
      onChange({ ...filters, [key]: value });
    },
    [filters, onChange],
  );

  const toggleAmenity = useCallback(
    (amenity: string) => {
      const current = filters.amenities;
      const updated = current.includes(amenity)
        ? current.filter((a) => a !== amenity)
        : [...current, amenity];
      updateFilter("amenities", updated);
    },
    [filters.amenities, updateFilter],
  );

  const clearAll = useCallback(() => {
    onChange({
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
  }, [onChange]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            placeholder="Search stays, services, districts, or travel needs..."
            className="pl-10"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter("search", "")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          variant={showAdvanced ? "secondary" : "outline"}
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="shrink-0"
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-2 flex h-5 w-5 items-center justify-center p-0 text-[10px]">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Provider type filters">
        <button
          type="button"
          onClick={() => updateFilter("propertyType", null)}
          aria-pressed={!filters.propertyType}
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
            !filters.propertyType
              ? "border-transparent bg-primary text-primary-foreground"
              : "border-border hover:bg-accent"
          }`}
        >
          All Types
        </button>
        {PROVIDER_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() =>
              updateFilter(
                "propertyType",
                filters.propertyType === type.value ? null : type.value,
              )
            }
            aria-pressed={filters.propertyType === type.value}
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
              filters.propertyType === type.value
                ? "border-transparent bg-primary text-primary-foreground"
                : "border-border hover:bg-accent"
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {showAdvanced && (
        <div className="animate-in slide-in-from-top-2 space-y-5 rounded-xl border bg-muted/30 p-5 duration-200">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">District</label>
              <Select
                value={filters.district || "__all__"}
                onValueChange={(v) =>
                  updateFilter("district", v === "__all__" ? null : v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any district" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Any district</SelectItem>
                  {KARNALI_DISTRICTS.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Budget Range</label>
              <Select
                value={filters.priceRange || "__all__"}
                onValueChange={(v) =>
                  updateFilter("priceRange", v === "__all__" ? null : v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Any budget</SelectItem>
                  {PRICE_RANGES.map((range) => (
                    <SelectItem key={range.label} value={`${range.min}-${range.max}`}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Rating</label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => updateFilter("starRating", null)}
                  className={`rounded-md border px-2.5 py-1.5 text-xs transition-colors ${
                    !filters.starRating
                      ? "border-primary bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  Any
                </button>
                {STAR_RATINGS.map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      updateFilter("starRating", filters.starRating === star ? null : star)
                    }
                    className={`flex items-center gap-0.5 rounded-md border px-2 py-1.5 text-xs transition-colors ${
                      filters.starRating === star
                        ? "border-primary bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    {star}
                    <Star className="h-3 w-3 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">Verification</label>
              <Select
                value={filters.verificationStatus || "__all__"}
                onValueChange={(v) =>
                  updateFilter("verificationStatus", v === "__all__" ? null : v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Any status</SelectItem>
                  <SelectItem value="PUBLIC_LISTING">Public Listing</SelectItem>
                  <SelectItem value="VERIFIED">Verified</SelectItem>
                  <SelectItem value="PARTNER">Partner</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Area</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={filters.location}
                onChange={(e) => updateFilter("location", e.target.value)}
                placeholder="Area, district, or address..."
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Services & Amenities</label>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Service and amenity filters">
              {AMENITY_OPTIONS.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  aria-pressed={filters.amenities.includes(amenity)}
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                    filters.amenities.includes(amenity)
                      ? "border-transparent bg-primary text-primary-foreground"
                      : "border-border hover:bg-accent"
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          {activeFilterCount > 0 && (
            <div className="flex items-center justify-between border-t pt-2">
              <p className="text-sm text-muted-foreground">
                {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} active
              </p>
              <Button variant="ghost" size="sm" onClick={clearAll}>
                <X className="mr-1 h-3.5 w-3.5" /> Clear All
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{totalResults}</span> of{" "}
          {totalHotels} stays & services
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort:</span>
          <Select
            value={filters.sortBy}
            onValueChange={(v) => updateFilter("sortBy", v as HotelFilters["sortBy"])}
          >
            <SelectTrigger className="h-8 w-[150px] text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}


