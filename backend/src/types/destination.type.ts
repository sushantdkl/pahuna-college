import { z } from "zod";

const optionalNumber = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) return undefined;
    return Number(value);
  },
  z.number().finite().optional(),
);

const optionalBoolean = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) return undefined;
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return value.toLowerCase() === "true";
    return Boolean(value);
  },
  z.boolean().optional(),
);

const stringArray = z.preprocess((value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return trimmed.split(",").map((item) => item.trim()).filter(Boolean);
    }
  }

  return [];
}, z.array(z.string().trim().min(1)).default([]));

export const DestinationSchema = z.object({
  name: z.string().trim().min(1, "Destination name is required"),
  slug: z.string().trim().optional(),
  description: z.string().trim().min(1, "Description is required"),
  attractions: stringArray,
  bestTimeToVisit: z.string().trim().optional(),
  distanceFromSurkhetKm: optionalNumber,
  latitude: optionalNumber,
  longitude: optionalNumber,
  images: stringArray,
  category: z.string().trim().optional(),
  district: z.string().trim().optional(),
  isActive: optionalBoolean.default(true),
  isFeatured: optionalBoolean.default(false),
});

export type DestinationType = z.infer<typeof DestinationSchema>;
