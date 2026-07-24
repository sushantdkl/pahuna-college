"use client";

import { GoogleMapsProvider } from "./google-maps-provider";
import { PahunaMap } from "./pahuna-map";
import { PahunaMarker } from "./pahuna-marker";
import { PahunaInfoCard } from "./pahuna-info-card";
import { SURKHET_CENTER, ZOOM } from "./map-constants";

interface MapExperience {
  title: string;
  slug: string;
  latitude?: number;
  longitude?: number;
  coverImage?: string;
  category?: string;
}

interface ExperiencesMapSectionProps {
  experiences: MapExperience[];
}

/**
 * Multi-marker map showing experience locations.
 */
export function ExperiencesMapSection({ experiences }: ExperiencesMapSectionProps) {
  const mappable = experiences.filter((e) => e.latitude && e.longitude);

  if (mappable.length === 0) return null;

  return (
    <GoogleMapsProvider>
      <PahunaMap
        center={SURKHET_CENTER}
        zoom={ZOOM.city}
        className="w-full h-[280px] md:h-[350px] rounded-xl overflow-hidden"
        fallbackLabel="Experiences in Surkhet"
      >
        {mappable.map((exp) => (
          <PahunaMarker
            key={exp.slug}
            position={{ lat: exp.latitude!, lng: exp.longitude! }}
            title={exp.title}
            category="experience"
          >
            <PahunaInfoCard
              name={exp.title}
              href={`/experiences#${exp.slug}`}
              image={exp.coverImage}
              subtitle={exp.category}
              category="experience"
            />
          </PahunaMarker>
        ))}
      </PahunaMap>
    </GoogleMapsProvider>
  );
}


