// @ts-nocheck
"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Map as MapIcon, List, Mountain, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DestinationCard } from "@/components/explore/destination-card";
import { ExploreInteractiveMap } from "@/components/maps/explore-interactive-map";
import { PahunaDirections } from "@/components/maps/pahuna-directions";
import { EmptyState } from "@/components/shared/empty-state";

interface ExplorerDestination {
  name: string;
  slug: string;
  shortDesc: string;
  coverImage?: string;
  bestSeason?: string;
  entryFee?: string;
  category?: string;
  isFeatured?: boolean;
  latitude?: number;
  longitude?: number;
}

interface ExplorerExperience {
  title: string;
  slug: string;
  shortDesc: string;
  coverImage?: string;
  category?: string;
  duration?: string;
  difficulty?: string;
  priceRange?: string;
  isFeatured?: boolean;
  latitude?: number;
  longitude?: number;
}

interface ExploreExplorerProps {
  destinations: ExplorerDestination[];
  experiences: ExplorerExperience[];
}

type CategoryFilter = "all" | "destination" | "lake" | "temple" | "experience";

const CATEGORY_FILTERS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All Places" },
  { value: "destination", label: "Destinations" },
  { value: "lake", label: "Lakes" },
  { value: "temple", label: "Temples" },
  { value: "experience", label: "Experiences" },
];

/**
 * Interactive Explore explorer — destinations + experiences on map
 * with category filters, bidirectional selection, and mobile list/map toggle.
 */
export function ExploreExplorer({
  destinations,
  experiences,
}: ExploreExplorerProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const [categoryFilter, setCategoryFilter] =
    useState<CategoryFilter>("all");
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Merge destinations + experiences into unified place list for the map
  const allPlaces = useMemo(() => {
    const destPlaces = destinations.map((d) => ({
      name: d.name,
      slug: d.slug,
      latitude: d.latitude,
      longitude: d.longitude,
      coverImage: d.coverImage,
      category: d.category ?? "destination",
      subtitle: d.bestSeason ? `Best: ${d.bestSeason}` : undefined,
      href: `/explore#${d.slug}`,
      type: "destination" as const,
    }));
    const expPlaces = experiences.map((e) => ({
      name: e.title,
      slug: e.slug,
      latitude: e.latitude,
      longitude: e.longitude,
      coverImage: e.coverImage,
      category: "experience",
      subtitle: e.duration,
      href: `/experiences#${e.slug}`,
      type: "experience" as const,
    }));
    return [...destPlaces, ...expPlaces];
  }, [destinations, experiences]);

  // Filter destinations by category
  const filteredDestinations = useMemo(() => {
    if (categoryFilter === "all" || categoryFilter === "experience")
      return destinations;
    return destinations.filter((d) => (d.category ?? "destination") === categoryFilter);
  }, [destinations, categoryFilter]);

  const showExperiences =
    categoryFilter === "all" || categoryFilter === "experience";

  // Filter map places by category
  const filteredPlaces = useMemo(() => {
    if (categoryFilter === "all") return allPlaces;
    if (categoryFilter === "experience")
      return allPlaces.filter((p) => p.type === "experience");
    return allPlaces.filter(
      (p) => p.type === "destination" && p.category === categoryFilter,
    );
  }, [allPlaces, categoryFilter]);

  // Scroll selected card into view
  useEffect(() => {
    if (selectedSlug && cardRefs.current[selectedSlug]) {
      cardRefs.current[selectedSlug]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedSlug]);

  const selectedPlace = selectedSlug
    ? allPlaces.find((p) => p.slug === selectedSlug)
    : null;

  return (
    <div>
      {/* ── Category Filters ── */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORY_FILTERS.map((cat) => (
          <Badge
            key={cat.value}
            variant={categoryFilter === cat.value ? "default" : "outline"}
            className="cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-primary hover:text-primary-foreground"
            onClick={() => setCategoryFilter(cat.value)}
          >
            {cat.label}
          </Badge>
        ))}
      </div>

      {/* ── Mobile view toggle ── */}
      <div className="flex items-center justify-between mb-4 lg:hidden">
        <div className="flex rounded-lg border p-0.5">
          <Button
            variant={mobileView === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMobileView("list")}
            className="gap-1.5"
          >
            <List className="h-4 w-4" /> List
          </Button>
          <Button
            variant={mobileView === "map" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMobileView("map")}
            className="gap-1.5"
          >
            <MapIcon className="h-4 w-4" /> Map
          </Button>
        </div>
        {selectedPlace?.latitude && selectedPlace?.longitude && (
          <PahunaDirections
            lat={selectedPlace.latitude}
            lng={selectedPlace.longitude}
          />
        )}
      </div>

      {/* ── Desktop: side-by-side | Mobile: toggle ── */}
      <div className="lg:grid lg:grid-cols-5 lg:gap-6">
        {/* Cards — left panel */}
        <div
          className={`lg:col-span-3 ${
            mobileView === "map" ? "hidden lg:block" : ""
          }`}
        >
          {filteredDestinations.length > 0 || (showExperiences && experiences.length > 0) ? (
            <div className="space-y-8 lg:max-h-[calc(100vh-220px)] lg:overflow-y-auto lg:pr-2">
              {/* Destinations */}
              {filteredDestinations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Mountain className="h-5 w-5 text-emerald-500" />
                    Destinations
                    <span className="text-sm font-normal text-muted-foreground">
                      ({filteredDestinations.length})
                    </span>
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {filteredDestinations.map((dest) => (
                      <div
                        key={dest.slug}
                        ref={(el) => {
                          cardRefs.current[dest.slug] = el;
                        }}
                        onMouseEnter={() => setSelectedSlug(dest.slug)}
                        onMouseLeave={() => setSelectedSlug(null)}
                      >
                        <DestinationCard
                          name={dest.name}
                          slug={dest.slug}
                          shortDesc={dest.shortDesc}
                          coverImage={dest.coverImage}
                          bestSeason={dest.bestSeason}
                          entryFee={dest.entryFee}
                          category={dest.category}
                          isFeatured={dest.isFeatured}
                          isActive={selectedSlug === dest.slug}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experiences Preview */}
              {showExperiences && experiences.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Compass className="h-5 w-5 text-violet-500" />
                    Things to Do
                    <span className="text-sm font-normal text-muted-foreground">
                      ({experiences.length})
                    </span>
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {experiences.map((exp) => (
                      <div
                        key={exp.slug}
                        ref={(el) => {
                          cardRefs.current[exp.slug] = el;
                        }}
                        onMouseEnter={() => setSelectedSlug(exp.slug)}
                        onMouseLeave={() => setSelectedSlug(null)}
                      >
                        <div
                          className={`rounded-lg border p-3 transition-all cursor-pointer ${
                            selectedSlug === exp.slug
                              ? "ring-2 ring-primary shadow-lg"
                              : "hover:shadow-md"
                          }`}
                        >
                          <p className="font-medium text-sm">{exp.title}</p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                            {exp.shortDesc}
                          </p>
                          <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                            {exp.category && (
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                {exp.category}
                              </Badge>
                            )}
                            {exp.duration && <span>{exp.duration}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              icon={<Mountain className="h-14 w-14" />}
              title="No places match this filter"
              description="Try selecting a different category."
            />
          )}
        </div>

        {/* Map — right panel (sticky on desktop) */}
        <div
          className={`lg:col-span-2 ${
            mobileView === "list" ? "hidden lg:block" : ""
          }`}
        >
          <div className="lg:sticky lg:top-20 rounded-xl overflow-hidden">
            <ExploreInteractiveMap
              places={filteredPlaces}
              selectedSlug={selectedSlug}
              onSelectPlace={(slug) => {
                setSelectedSlug(slug);
                if (slug && mobileView === "map") {
                  setMobileView("list");
                }
              }}
              className="w-full h-[50vh] lg:h-[calc(100vh-220px)] rounded-xl overflow-hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
}


