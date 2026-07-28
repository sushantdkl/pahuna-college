// @ts-nocheck
"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { getImageOrPlaceholder } from "@/lib/assets";
import { cn } from "@/lib/utils";

/**
 * OptimizedImage - wraps Next.js Image with:
 * - Blur placeholder shimmer while loading
 * - Graceful error fallback
 * - Lazy loading by default
 * - Consistent rounded corners
 */

interface OptimizedImageProps extends Omit<ImageProps, "onError" | "onLoad"> {
  fallbackSrc?: string;
  aspectRatio?: "video" | "square" | "portrait" | "wide";
}

const aspectClasses = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  wide: "aspect-[2/1]",
};

export function OptimizedImage({
  className,
  fallbackSrc = getImageOrPlaceholder(undefined, "service"),
  aspectRatio,
  alt,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted",
        aspectRatio && aspectClasses[aspectRatio],
        className,
      )}
    >
      <Image
        {...props}
        alt={alt}
        src={hasError ? fallbackSrc : props.src}
        loading={props.priority ? undefined : "lazy"}
        className={cn(
          "object-cover transition-opacity duration-500",
          isLoading ? "opacity-0" : "opacity-100",
          props.fill ? "absolute inset-0" : "",
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          if (!hasError) {
            setHasError(true);
          }
          setIsLoading(false);
        }}
      />
      {/* Shimmer placeholder */}
      {isLoading && (
        <div className="absolute inset-0 animate-pulse bg-linear-to-r from-muted via-muted-foreground/5 to-muted" />
      )}
    </div>
  );
}


