"use client";

import { GoogleMapsProvider } from "./google-maps-provider";
import { PahunaMap } from "./pahuna-map";
import { PahunaMarker } from "./pahuna-marker";
import { PahunaInfoCard } from "./pahuna-info-card";
import { SURKHET_CENTER, ZOOM } from "./map-constants";

interface InteractiveExperience {
  title: string;
  slug: string;
  latitude?: number;
  longitude?: number;
  coverImage?: string;
  category?: string;
  duration?: string;
}

interface ExperiencesInteractiveMapProps {
  experiences: InteractiveExperience[];
  selectedSlug: string | null;
  onSelectExperience: (slug: string | null) => void;
  className?: string;
}

/**
 * Interactive experience map with bidirectional selection.
 * Clicking a marker selects it; selection is controlled externally.
 */
export function ExperiencesInteractiveMap({
  experiences,
  selectedSlug,
  onSelectExperience,
  className,
}: ExperiencesInteractiveMapProps) {
  const mappable = experiences.filter((e) => e.latitude && e.longitude);

  if (mappable.length === 0) return null;

  return (
    <GoogleMapsProvider>
      <PahunaMap
        center={SURKHET_CENTER}
        zoom={ZOOM.city}
        className={
          className ??
          "w-full h-full min-h-[300px] rounded-xl overflow-hidden"
        }
        fallbackLabel="Experiences in Surkhet"
      >
        {mappable.map((exp) => (
          <PahunaMarker
            key={exp.slug}
            position={{ lat: exp.latitude!, lng: exp.longitude! }}
            title={exp.title}
            category="experience"
            isActive={selectedSlug === exp.slug}
            isOpen={selectedSlug === exp.slug}
            onOpenChange={(open) =>
              onSelectExperience(open ? exp.slug : null)
            }
          >
            <PahunaInfoCard
              name={exp.title}
              href={`/experiences#${exp.slug}`}
              image={exp.coverImage}
              subtitle={exp.duration ?? exp.category}
              category="experience"
            />
          </PahunaMarker>
        ))}
      </PahunaMap>
    </GoogleMapsProvider>
  );
}


