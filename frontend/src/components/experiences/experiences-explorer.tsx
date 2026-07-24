// @ts-nocheck
"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Map as MapIcon, List, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExperienceCard } from "@/components/experiences/experience-card";
import { ExperiencesInteractiveMap } from "@/components/maps/experiences-interactive-map";
import { PahunaDirections } from "@/components/maps/pahuna-directions";
import { EmptyState } from "@/components/shared/empty-state";
import { EXPERIENCE_CATEGORIES } from "@backend/lib/constants";

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

interface ExperiencesExplorerProps {
  experiences: ExplorerExperience[];
}

const categoryEmojis: Record<string, string> = {
  ADVENTURE: "🥾",
  CULTURE: "🎭",
  NATURE: "🦅",
  FOOD: "🍛",
  HERITAGE: "🏛️",
  WELLNESS: "🧘",
  RELIGIOUS: "🛕",
  EVENTS: "🎉",
};

/**
 * Interactive Experiences explorer — cards + map with category filters,
 * bidirectional selection, and mobile list/map toggle.
 */
export function ExperiencesExplorer({
  experiences,
}: ExperiencesExplorerProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const filteredExperiences = useMemo(() => {
    if (categoryFilter === "ALL") return experiences;
    return experiences.filter((e) => e.category === categoryFilter);
  }, [experiences, categoryFilter]);

  // Scroll selected card into view
  useEffect(() => {
    if (selectedSlug && cardRefs.current[selectedSlug]) {
      cardRefs.current[selectedSlug]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedSlug]);

  const selectedExperience = selectedSlug
    ? experiences.find((e) => e.slug === selectedSlug)
    : null;

  return (
    <div>
      {/* ── Category Filters ── */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <Badge
          variant={categoryFilter === "ALL" ? "default" : "outline"}
          className="cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-primary hover:text-primary-foreground"
          onClick={() => setCategoryFilter("ALL")}
        >
          All
        </Badge>
        {EXPERIENCE_CATEGORIES.map((cat) => (
          <Badge
            key={cat.value}
            variant={categoryFilter === cat.value ? "default" : "outline"}
            className="cursor-pointer px-4 py-2 text-sm transition-colors hover:bg-primary hover:text-primary-foreground"
            onClick={() => setCategoryFilter(cat.value)}
          >
            {categoryEmojis[cat.value]} {cat.label}
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
        {selectedExperience?.latitude && selectedExperience?.longitude && (
          <PahunaDirections
            lat={selectedExperience.latitude}
            lng={selectedExperience.longitude}
          />
        )}
      </div>

      {/* ── Desktop: side-by-side | Mobile: toggle ── */}
      <div className="lg:grid lg:grid-cols-5 lg:gap-6">
        {/* Experience cards — left panel */}
        <div
          className={`lg:col-span-3 ${
            mobileView === "map" ? "hidden lg:block" : ""
          }`}
        >
          {filteredExperiences.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-5 lg:max-h-[calc(100vh-220px)] lg:overflow-y-auto lg:pr-2">
              {filteredExperiences.map((exp) => (
                <div
                  key={exp.slug}
                  ref={(el) => {
                    cardRefs.current[exp.slug] = el;
                  }}
                  onMouseEnter={() => setSelectedSlug(exp.slug)}
                  onMouseLeave={() => setSelectedSlug(null)}
                >
                  <ExperienceCard
                    title={exp.title}
                    slug={exp.slug}
                    shortDesc={exp.shortDesc}
                    coverImage={exp.coverImage}
                    category={exp.category}
                    duration={exp.duration}
                    difficulty={exp.difficulty}
                    priceRange={exp.priceRange}
                    isFeatured={exp.isFeatured}
                    isActive={selectedSlug === exp.slug}
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Compass className="h-14 w-14" />}
              title="No experiences match this category"
              description="Try selecting a different category or view all experiences."
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
            <ExperiencesInteractiveMap
              experiences={filteredExperiences}
              selectedSlug={selectedSlug}
              onSelectExperience={(slug) => {
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


