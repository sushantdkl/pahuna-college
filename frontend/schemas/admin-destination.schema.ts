import { z } from "zod";

const optionalNumberInput = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) return undefined;
    return Number(value);
  },
  z.number().finite().optional(),
);

export const adminDestinationFormSchema = z.object({
  name: z.string().trim().min(1, "Destination name is required"),
  slug: z.string().trim().optional(),
  description: z.string().trim().min(1, "Description is required"),
  attractions: z.array(z.string()).default([]),
  bestTimeToVisit: z.string().trim().optional(),
  distanceFromSurkhetKm: optionalNumberInput,
  latitude: optionalNumberInput,
  longitude: optionalNumberInput,
  images: z.array(z.string()).default([]),
  category: z.string().trim().optional(),
  district: z.string().trim().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export type AdminDestinationFormData = z.infer<typeof adminDestinationFormSchema>;
