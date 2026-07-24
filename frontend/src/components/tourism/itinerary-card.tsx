// @ts-nocheck
"use client";

import Link from "next/link";
import { Clock, DollarSign, Users, Mountain, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ItineraryCardProps {
  title: string;
  slug: string;
  shortDesc: string;
  duration: string;
  totalDays: number;
  difficulty: string;
  estimatedCost: string;
  bestSeason: string;
  groupSize: string;
  isFeatured?: boolean;
  /** Compact layout for sidebar / grid use */
  compact?: boolean;
}

export function ItineraryCard({
  title,
  slug,
  shortDesc,
  duration,
  totalDays,
  difficulty,
  estimatedCost,
  bestSeason,
  groupSize,
  isFeatured,
  compact = false,
}: ItineraryCardProps) {
  if (compact) {
    return (
      <Card className="overflow-hidden border hover:shadow-md transition-all group">
        <div className="relative aspect-[2/1] overflow-hidden bg-muted">
          <div className="h-full w-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
            <span className="text-5xl">🗺️</span>
          </div>
          {isFeatured && (
            <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs">
              Popular
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {shortDesc}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {totalDays}D
            </span>
            <span className="flex items-center gap-1">
              <Mountain className="h-3 w-3" /> {difficulty}
            </span>
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="w-full mt-3 text-xs"
          >
            <Link href={`/itineraries/${slug}`}>
              View Plan <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border hover:shadow-lg transition-all group">
      <div className="grid md:grid-cols-3">
        <div className="md:col-span-1 relative aspect-video md:aspect-auto overflow-hidden bg-muted min-h-[220px]">
          <div className="h-full w-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
            <span className="text-6xl">🗺️</span>
          </div>
          {isFeatured && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
              Popular
            </Badge>
          )}
        </div>
        <CardContent className="md:col-span-2 p-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="outline">{duration}</Badge>
            <Badge variant="outline">{difficulty}</Badge>
          </div>
          <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
            {title}
          </h2>
          <p className="text-muted-foreground mb-6">{shortDesc}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Duration</div>
                <div className="font-medium">{totalDays} Days</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Est. Cost</div>
                <div className="font-medium">{estimatedCost}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Group Size</div>
                <div className="font-medium">{groupSize}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mountain className="h-4 w-4 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Best Season</div>
                <div className="font-medium">{bestSeason}</div>
              </div>
            </div>
          </div>
          <Button asChild>
            <Link href={`/itineraries/${slug}`}>
              View Day-by-Day Plan <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}


