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

export const ExperienceSchema = z.object({
  providerId: z.string().trim().optional(),
  name: z.string().trim().min(1, "Experience name is required"),
  description: z.string().trim().min(1, "Description is required"),
  category: z.string().trim().min(1, "Category is required"),
  price: optionalNumber,
  duration: z.string().trim().optional(),
  location: z.string().trim().min(1, "Location is required"),
  latitude: optionalNumber,
  longitude: optionalNumber,
  maxParticipants: optionalNumber,
  images: stringArray,
  rating: optionalNumber,
  reviewCount: optionalNumber,
  isActive: optionalBoolean.default(true),
});

export type ExperienceType = z.infer<typeof ExperienceSchema>;
