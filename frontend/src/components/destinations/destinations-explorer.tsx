// @ts-nocheck
"use client";

import { useMemo, useState } from "react";
import type { DestinationCategory, TravelDifficulty } from "@/lib/prisma-types";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PublicDestination } from "@/lib/services/destinations";
import { DestinationCard } from "./destination-card";
import { DestinationFilters } from "./destination-filters";

interface DestinationsExplorerProps {
  destinations: PublicDestination[];
}

export function DestinationsExplorer({ destinations }: DestinationsExplorerProps) {
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("all");
  const [category, setCategory] = useState<"all" | DestinationCategory>("all");
  const [difficulty, setDifficulty] = useState<"all" | TravelDifficulty>("all");

  const districts = useMemo(
    () => Array.from(new Set(destinations.map((item) => item.district))).sort(),
    [destinations],
  );

  const categories = useMemo(
    () =>
      Array.from(
        new Map(
          destinations.map((item) => [
            item.category,
            { value: item.category, label: item.categoryLabel },
          ]),
        ).values(),
      ).sort((a, b) => a.label.localeCompare(b.label)),
    [destinations],
  );

  const difficulties = useMemo(
    () =>
      Array.from(
        new Map(
          destinations.map((item) => [
            item.difficulty,
            { value: item.difficulty, label: item.difficultyLabel },
          ]),
        ).values(),
      ),
    [destinations],
  );

  const filteredDestinations = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return destinations.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        [item.name, item.district, item.categoryLabel, item.shortDescription]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);
      const matchesDistrict = district === "all" || item.district === district;
      const matchesCategory = category === "all" || item.category === category;
      const matchesDifficulty =
        difficulty === "all" || item.difficulty === difficulty;

      return matchesSearch && matchesDistrict && matchesCategory && matchesDifficulty;
    });
  }, [category, destinations, difficulty, district, search]);

  function clearFilters() {
    setSearch("");
    setDistrict("all");
    setCategory("all");
    setDifficulty("all");
  }

  return (
    <div className="space-y-8">
      <DestinationFilters
        search={search}
        onSearchChange={setSearch}
        districts={districts}
        selectedDistrict={district}
        onDistrictChange={setDistrict}
        categories={categories}
        selectedCategory={category}
        onCategoryChange={setCategory}
        difficulties={difficulties}
        selectedDifficulty={difficulty}
        onDifficultyChange={setDifficulty}
        onClear={clearFilters}
      />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-primary">
            Karnali guide
          </p>
          <h2 className="text-2xl font-bold tracking-tight">
            Showing {filteredDestinations.length} destinations
          </h2>
        </div>
        <p className="max-w-xl text-sm text-muted-foreground">
          Entries are temporary tourism database records and should be physically
          verified before final commercial use.
        </p>
      </div>

      {filteredDestinations.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredDestinations.map((destination) => (
            <DestinationCard key={destination.slug} destination={destination} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-muted/30 p-10 text-center">
          <MapPin className="mx-auto mb-4 h-10 w-10 text-primary" />
          <h3 className="text-xl font-semibold">No destinations found</h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            Try changing your district, category, difficulty, or search term.
          </p>
          <Button className="mt-6" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}


