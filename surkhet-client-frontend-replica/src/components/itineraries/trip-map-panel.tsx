"use client";

import { useState, useRef, useEffect } from "react";
import { Map as MapIcon, List, Route, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TripStopCard } from "@/components/itineraries/trip-stop-card";
import { TripRouteMap } from "@/components/maps/trip-route-map";

interface TripDay {
  dayNumber: number;
  title: string;
  description?: string;
  activities: string[];
  meals?: string;
  overnight?: string;
  latitude?: number;
  longitude?: number;
}

interface TripMapPanelProps {
  days: TripDay[];
  title: string;
  duration?: string;
  estimatedCost?: string;
}

/**
 * Interactive trip map panel — side-by-side stop cards + route map
 * with bidirectional selection, mobile toggle, and trip header.
 */
export function TripMapPanel({
  days,
  title,
  duration,
  estimatedCost,
}: TripMapPanelProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [mobileView, setMobileView] = useState<"stops" | "map">("stops");
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Scroll selected card into view
  useEffect(() => {
    if (selectedDay && cardRefs.current[selectedDay]) {
      cardRefs.current[selectedDay]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedDay]);

  const openDirections = (lat: number, lng: number) => {
    window.open(
      `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div>
      {/* ── Trip Summary Header ── */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Route className="h-5 w-5 text-indigo-500" />
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        <div className="flex gap-2">
          {duration && (
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" /> {duration}
            </Badge>
          )}
          {estimatedCost && (
            <Badge variant="outline" className="gap-1">
              <DollarSign className="h-3 w-3" /> {estimatedCost}
            </Badge>
          )}
          <Badge variant="secondary">{days.length} stops</Badge>
        </div>
      </div>

      {/* ── Mobile view toggle ── */}
      <div className="flex items-center justify-between mb-4 lg:hidden">
        <div className="flex rounded-lg border p-0.5">
          <Button
            variant={mobileView === "stops" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMobileView("stops")}
            className="gap-1.5"
          >
            <List className="h-4 w-4" /> Stops
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
        <span className="text-xs text-muted-foreground">
          Tap a stop to highlight on map
        </span>
      </div>

      {/* ── Desktop: side-by-side | Mobile: toggle ── */}
      <div className="lg:grid lg:grid-cols-5 lg:gap-6">
        {/* Stop cards — left panel */}
        <div
          className={`lg:col-span-3 ${
            mobileView === "map" ? "hidden lg:block" : ""
          }`}
        >
          <div className="space-y-3 lg:max-h-[calc(100vh-280px)] lg:overflow-y-auto lg:pr-2">
            {days.map((day) => (
              <div
                key={day.dayNumber}
                ref={(el) => {
                  cardRefs.current[day.dayNumber] = el;
                }}
                onMouseEnter={() => setSelectedDay(day.dayNumber)}
                onMouseLeave={() => setSelectedDay(null)}
                onClick={() =>
                  setSelectedDay(
                    selectedDay === day.dayNumber ? null : day.dayNumber,
                  )
                }
              >
                <TripStopCard
                  dayNumber={day.dayNumber}
                  title={day.title}
                  description={day.description}
                  activities={day.activities}
                  meals={day.meals}
                  overnight={day.overnight}
                  latitude={day.latitude}
                  longitude={day.longitude}
                  isActive={selectedDay === day.dayNumber}
                  onDirections={
                    day.latitude && day.longitude
                      ? () => openDirections(day.latitude!, day.longitude!)
                      : undefined
                  }
                />
              </div>
            ))}
          </div>

          {/* Route Legend (desktop) */}
          <div className="hidden lg:flex items-center gap-6 mt-4 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-white text-[10px] font-bold">
                1
              </span>
              Numbered stop
            </span>
            <span className="flex items-center gap-2">
              <span className="h-0.5 w-6 bg-indigo-500 rounded" />
              Route path
            </span>
            <span className="flex items-center gap-2">
              <span className="h-5 w-5 rounded-full ring-2 ring-primary bg-indigo-500/20" />
              Selected
            </span>
          </div>
        </div>

        {/* Map — right panel (sticky on desktop) */}
        <div
          className={`lg:col-span-2 ${
            mobileView === "stops" ? "hidden lg:block" : ""
          }`}
        >
          <div className="lg:sticky lg:top-20 rounded-xl overflow-hidden">
            <TripRouteMap
              days={days}
              selectedDay={selectedDay}
              onSelectDay={(dayNum) => {
                setSelectedDay(dayNum);
                if (dayNum && mobileView === "map") {
                  setMobileView("stops");
                }
              }}
              className="w-full h-[50vh] lg:h-[calc(100vh-280px)] rounded-xl overflow-hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
}


