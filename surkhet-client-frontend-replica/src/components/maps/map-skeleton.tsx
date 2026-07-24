"use client";

import { MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MapSkeletonProps {
  className?: string;
}

/**
 * Branded loading skeleton for Pahuna Maps.
 * Shown while the interactive map is initializing.
 */
export function MapSkeleton({
  className = "w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden",
}: MapSkeletonProps) {
  return (
    <div
      className={`${className} relative bg-slate-900/80 flex flex-col items-center justify-center gap-3`}
    >
      {/* Simulated map grid lines */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-0 right-0 h-px bg-slate-400" />
        <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-400" />
        <div className="absolute top-3/4 left-0 right-0 h-px bg-slate-400" />
        <div className="absolute left-1/4 top-0 bottom-0 w-px bg-slate-400" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-400" />
        <div className="absolute left-3/4 top-0 bottom-0 w-px bg-slate-400" />
      </div>

      {/* Animated center pin */}
      <div className="animate-pulse flex flex-col items-center gap-2">
        <div className="rounded-full bg-amber-500/20 p-3">
          <MapPin className="h-6 w-6 text-amber-400/60" />
        </div>
        <Skeleton className="h-3 w-24 bg-slate-700" />
        <Skeleton className="h-2 w-16 bg-slate-800" />
      </div>
    </div>
  );
}


