// @ts-nocheck
"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { FoodCard } from "./food-card";
import type { PublicFoodProvider } from "@/lib/services/food";

const ALL = "ALL";

export function FoodExplorer({ providers }: { providers: PublicFoodProvider[] }) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState(ALL);
  const [area, setArea] = useState(ALL);
  const [cuisine, setCuisine] = useState(ALL);
  const [feature, setFeature] = useState(ALL);
  const [priceLevel, setPriceLevel] = useState(ALL);
  const [verificationStatus, setVerificationStatus] = useState(ALL);

  const options = useMemo(() => {
    const unique = (values: Array<string | null | undefined>) =>
      Array.from(new Set(values.filter(Boolean) as string[])).sort();

    return {
      types: unique(providers.map((provider) => provider.type)),
      areas: unique(providers.map((provider) => provider.area)),
      cuisines: unique(providers.flatMap((provider) => provider.cuisines)),
      features: unique(providers.flatMap((provider) => provider.features)),
      priceLevels: unique(providers.map((provider) => provider.priceLevel ?? "UNKNOWN")),
      verificationStatuses: unique(providers.map((provider) => provider.verificationStatus)),
    };
  }, [providers]);

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return providers.filter((provider) => {
      if (type !== ALL && provider.type !== type) return false;
      if (area !== ALL && provider.area !== area) return false;
      if (cuisine !== ALL && !provider.cuisines.includes(cuisine)) return false;
      if (feature !== ALL && !provider.features.includes(feature)) return false;
      if (priceLevel !== ALL && (provider.priceLevel ?? "UNKNOWN") !== priceLevel) return false;
      if (verificationStatus !== ALL && provider.verificationStatus !== verificationStatus) return false;
      if (!normalizedSearch) return true;
      return [
        provider.name,
        provider.area,
        provider.shortDescription,
        ...provider.cuisines,
        ...provider.services,
        ...provider.features,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [area, cuisine, feature, priceLevel, providers, search, type, verificationStatus]);

  const selectClass = "h-10 min-w-[150px] bg-white";

  return (
    <div>
      <div className="rounded-2xl border border-emerald-100/80 bg-emerald-50/50 p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search cafes, momo, tea, local food..."
              className="h-10 bg-white pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterSelect value={type} onChange={setType} placeholder="Type" values={options.types} className={selectClass} />
            <FilterSelect value={area} onChange={setArea} placeholder="Area" values={options.areas} className={selectClass} />
            <FilterSelect value={cuisine} onChange={setCuisine} placeholder="Cuisine" values={options.cuisines} className={selectClass} />
            <FilterSelect value={feature} onChange={setFeature} placeholder="Feature" values={options.features} className={selectClass} />
            <FilterSelect value={priceLevel} onChange={setPriceLevel} placeholder="Price" values={options.priceLevels} className={selectClass} />
            <FilterSelect value={verificationStatus} onChange={setVerificationStatus} placeholder="Status" values={options.verificationStatuses} className={selectClass} />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>{filtered.length} of {providers.length} food listings</span>
          <Badge variant="secondary" className="bg-white">Public details require confirmation</Badge>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((provider) => (
            <FoodCard key={provider.slug} provider={provider} />
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState
            title="No food listings found"
            description="Try changing the filters or search terms."
            icon={<Search className="h-12 w-12" />}
          />
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  placeholder,
  values,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  values: string[];
  className?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>{placeholder}</SelectItem>
        {values.map((item) => (
          <SelectItem key={item} value={item}>
            {item.replace(/_/g, " ")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
