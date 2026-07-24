// @ts-nocheck
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Map as MapIcon,
  List,
  ArrowRight,
  Clock,
  DollarSign,
  Users,
  Mountain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ItinerariesInteractiveMap } from "@/components/maps/itineraries-interactive-map";
import { TripStopCard } from "@/components/itineraries/trip-stop-card";
import { cn } from "@backend/lib/utils";

interface ItineraryDay {
  dayNumber: number;
  title: string;
  latitude?: number;
  longitude?: number;
  activities: string[];
  meals?: string;
  overnight?: string;
}

interface ExplorerItinerary {
  title: string;
  slug: string;
  shortDesc: string;
  duration: string;
  totalDays: number;
  difficulty: string;
  estimatedCost: string;
  bestSeason: string;
  groupSize: string;
  coverImage: string;
  isFeatured: boolean;
  days: ItineraryDay[];
}

interface ItinerariesExplorerProps {
  itineraries: ExplorerItinerary[];
}

/**
 * Interactive itineraries explorer — trip cards + map with route previews,
 * bidirectional selection, and expandable stop previews.
 */
export function ItinerariesExplorer({
  itineraries,
}: ItinerariesExplorerProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Scroll selected card into view
  useEffect(() => {
    if (selectedSlug && cardRefs.current[selectedSlug]) {
      cardRefs.current[selectedSlug]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedSlug]);

  return (
    <div>
      {/* ── Mobile view toggle ── */}
      <div className="flex items-center justify-between mb-4 lg:hidden">
        <div className="flex rounded-lg border p-0.5">
          <Button
            variant={mobileView === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMobileView("list")}
            className="gap-1.5"
          >
            <List className="h-4 w-4" /> Trips
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
      </div>

      {/* ── Desktop: side-by-side | Mobile: toggle ── */}
      <div className="lg:grid lg:grid-cols-5 lg:gap-6">
        {/* Trip cards — left panel */}
        <div
          className={`lg:col-span-3 ${
            mobileView === "map" ? "hidden lg:block" : ""
          }`}
        >
          <div className="space-y-6 lg:max-h-[calc(100vh-220px)] lg:overflow-y-auto lg:pr-2">
            {itineraries.map((itin) => (
              <div
                key={itin.slug}
                ref={(el) => {
                  cardRefs.current[itin.slug] = el;
                }}
                onMouseEnter={() => setSelectedSlug(itin.slug)}
                onMouseLeave={() => setSelectedSlug(null)}
              >
                <Card
                  className={cn(
                    "overflow-hidden border transition-all hover:shadow-lg",
                    selectedSlug === itin.slug &&
                      "ring-2 ring-primary shadow-xl",
                  )}
                >
                  <div className="grid md:grid-cols-3">
                    <div className="md:col-span-1 relative aspect-video md:aspect-auto overflow-hidden bg-muted min-h-[200px]">
                      <Image
                        src={itin.coverImage}
                        alt={itin.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                      {itin.isFeatured && (
                        <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <CardContent className="md:col-span-2 p-6">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge variant="outline">{itin.duration}</Badge>
                        <Badge variant="outline">{itin.difficulty}</Badge>
                      </div>
                      <h2 className="text-xl font-bold mb-2">{itin.title}</h2>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {itin.shortDesc}
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-primary" />
                          <span className="text-xs">{itin.totalDays} Days</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="h-3.5 w-3.5 text-primary" />
                          <span className="text-xs truncate">
                            {itin.estimatedCost}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-primary" />
                          <span className="text-xs">{itin.groupSize}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Mountain className="h-3.5 w-3.5 text-primary" />
                          <span className="text-xs">{itin.bestSeason}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button asChild size="sm">
                          <Link href={`/itineraries/${itin.slug}`}>
                            View Full Plan{" "}
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedSlug(
                              expandedSlug === itin.slug
                                ? null
                                : itin.slug,
                            );
                          }}
                          className="text-xs"
                        >
                          {expandedSlug === itin.slug
                            ? "Hide Stops"
                            : `Preview ${itin.days.length} Stops`}
                        </Button>
                      </div>
                    </CardContent>
                  </div>

                  {/* Expandable stops preview */}
                  {expandedSlug === itin.slug && (
                    <div className="border-t px-4 py-4 bg-muted/20">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                        Route Preview
                      </p>
                      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {itin.days.map((day) => (
                          <TripStopCard
                            key={day.dayNumber}
                            dayNumber={day.dayNumber}
                            title={day.title}
                            activities={day.activities}
                            meals={day.meals}
                            overnight={day.overnight}
                            isCompact
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Map — right panel (sticky on desktop) */}
        <div
          className={`lg:col-span-2 ${
            mobileView === "list" ? "hidden lg:block" : ""
          }`}
        >
          <div className="lg:sticky lg:top-20 rounded-xl overflow-hidden">
            <ItinerariesInteractiveMap
              itineraries={itineraries}
              selectedSlug={selectedSlug}
              onSelectItinerary={(slug) => {
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


