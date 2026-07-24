// @ts-nocheck
"use client";

import type { DestinationCategory, TravelDifficulty } from "@backend/lib/prisma-types";
import type React from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@backend/lib/utils";

type FilterOption<T extends string> = {
  value: T;
  label: string;
};

interface DestinationFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  districts: string[];
  selectedDistrict: string;
  onDistrictChange: (value: string) => void;
  categories: FilterOption<DestinationCategory>[];
  selectedCategory: "all" | DestinationCategory;
  onCategoryChange: (value: "all" | DestinationCategory) => void;
  difficulties: FilterOption<TravelDifficulty>[];
  selectedDifficulty: "all" | TravelDifficulty;
  onDifficultyChange: (value: "all" | TravelDifficulty) => void;
  onClear: () => void;
}

export function DestinationFilters({
  search,
  onSearchChange,
  districts,
  selectedDistrict,
  onDistrictChange,
  categories,
  selectedCategory,
  onCategoryChange,
  difficulties,
  selectedDifficulty,
  onDifficultyChange,
  onClear,
}: DestinationFiltersProps) {
  const hasFilters =
    search ||
    selectedDistrict !== "all" ||
    selectedCategory !== "all" ||
    selectedDifficulty !== "all";

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-4 shadow-sm sm:p-5">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search destinations, districts, lakes, temples..."
          className="h-12 w-full rounded-2xl border border-border bg-background pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
      </div>

      <div className="mt-4 space-y-4">
        <FilterRow label="District">
          <FilterChip
            active={selectedDistrict === "all"}
            onClick={() => onDistrictChange("all")}
          >
            All
          </FilterChip>
          {districts.map((district) => (
            <FilterChip
              key={district}
              active={selectedDistrict === district}
              onClick={() => onDistrictChange(district)}
            >
              {district}
            </FilterChip>
          ))}
        </FilterRow>

        <FilterRow label="Category">
          <FilterChip
            active={selectedCategory === "all"}
            onClick={() => onCategoryChange("all")}
          >
            All
          </FilterChip>
          {categories.map((category) => (
            <FilterChip
              key={category.value}
              active={selectedCategory === category.value}
              onClick={() => onCategoryChange(category.value)}
            >
              {category.label}
            </FilterChip>
          ))}
        </FilterRow>

        <FilterRow label="Difficulty">
          <FilterChip
            active={selectedDifficulty === "all"}
            onClick={() => onDifficultyChange("all")}
          >
            All
          </FilterChip>
          {difficulties.map((difficulty) => (
            <FilterChip
              key={difficulty.value}
              active={selectedDifficulty === difficulty.value}
              onClick={() => onDifficultyChange(difficulty.value)}
            >
              {difficulty.label}
            </FilterChip>
          ))}
        </FilterRow>
      </div>

      {hasFilters && (
        <div className="mt-4">
          <Button variant="ghost" size="sm" onClick={onClear}>
            <X className="h-4 w-4" />
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2 md:grid-cols-[7rem_1fr] md:items-start">
      <span className="pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterChip({
  active,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm font-medium transition",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}


