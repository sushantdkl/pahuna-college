// @ts-nocheck
"use client";

import Link from "next/link";
import {
  Clock,
  Users,
  Mountain,
  ArrowRight,
  CheckCircle,
  PieChart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { TripPackage } from "@/lib/services";
import { formatPrice } from "@/lib/utils";

const tierColors: Record<string, string> = {
  budget: "bg-green-100 text-green-800 border-green-200",
  standard: "bg-blue-100 text-blue-800 border-blue-200",
  premium: "bg-amber-100 text-amber-800 border-amber-200",
};

const tierEmoji: Record<string, string> = {
  budget: "Budget",
  standard: "Standard",
  premium: "Premium",
};

interface PackageCardProps {
  pkg: TripPackage;
  /** Show cost split chart */
  showCostSplit?: boolean;
}

export function PackageCard({ pkg, showCostSplit = false }: PackageCardProps) {
  const tierLabel = pkg.tier.charAt(0).toUpperCase() + pkg.tier.slice(1);

  return (
    <Card className="overflow-hidden border hover:shadow-lg transition-all group h-full flex flex-col">
      {/* Image */}
      <div className="relative aspect-[2.2/1] overflow-hidden bg-muted">
        <div className="h-full w-full bg-linear-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
          <span className="text-xl font-black text-primary">{tierEmoji[pkg.tier]}</span>
        </div>
        <Badge
          className={`absolute top-3 left-3 ${tierColors[pkg.tier]} text-xs`}
        >
          {tierLabel}
        </Badge>
        {pkg.isFeatured && (
          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs">
            Featured
          </Badge>
        )}
      </div>

      <CardContent className="p-6 flex flex-col flex-1">
        {/* Title & Description */}
        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
          {pkg.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {pkg.shortDesc}
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span className="text-muted-foreground">{pkg.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-primary" />
            <span className="text-muted-foreground">{pkg.groupSize}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mountain className="h-3.5 w-3.5 text-primary" />
            <span className="text-muted-foreground">{pkg.bestSeason}</span>
          </div>
        </div>

        {/* Highlights */}
        <div className="space-y-1.5 mb-4">
          {pkg.highlights.slice(0, 4).map((h) => (
            <div key={h} className="flex items-start gap-2 text-sm">
              <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{h}</span>
            </div>
          ))}
        </div>

        {/* Cost Split */}
        {showCostSplit && (
          <div className="mb-4">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
              <PieChart className="h-3 w-3" /> Budget Split
            </div>
            <div className="flex h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-500"
                style={{ width: `${pkg.costSplit.accommodation}%` }}
                title={`Accommodation ${pkg.costSplit.accommodation}%`}
              />
              <div
                className="bg-amber-500"
                style={{ width: `${pkg.costSplit.food}%` }}
                title={`Food ${pkg.costSplit.food}%`}
              />
              <div
                className="bg-green-500"
                style={{ width: `${pkg.costSplit.transport}%` }}
                title={`Transport ${pkg.costSplit.transport}%`}
              />
              <div
                className="bg-purple-500"
                style={{ width: `${pkg.costSplit.activities}%` }}
                title={`Activities ${pkg.costSplit.activities}%`}
              />
              <div
                className="bg-gray-400"
                style={{ width: `${pkg.costSplit.misc}%` }}
                title={`Misc ${pkg.costSplit.misc}%`}
              />
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Stay</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Food</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" /> Transport</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Activities</span>
            </div>
          </div>
        )}

        {/* Spacer to push pricing and button to bottom */}
        <div className="flex-1" />

        <Separator className="my-4" />

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Per person</div>
            <div className="text-lg font-bold text-primary">
              {formatPrice(pkg.pricePerPerson.min)}
              <span className="text-xs font-normal text-muted-foreground">
                {" "}- {formatPrice(pkg.pricePerPerson.max)}
              </span>
            </div>
          </div>
          <Button asChild size="sm">
            <Link href={`/packages/${pkg.slug}`}>
              View Details <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


