import { z } from "zod";

const stringList = z.array(z.string().trim().min(1).max(500)).max(80).default([]);

export const tripPackageFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(180),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words and hyphens")
    .max(220)
    .optional()
    .or(z.literal("")),
  description: z.string().trim().min(1, "Description is required").max(12000),
  destinationId: z.string().trim().optional(),
  durationDays: z.number().int().min(1).optional(),
  price: z.number().min(0).optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  itinerary: stringList,
  inclusions: stringList,
  exclusions: stringList,
  highlights: stringList,
  difficulty: z.string().trim().max(80).optional(),
  groupSize: z.string().trim().max(80).optional(),
  images: z.array(z.string().trim().max(500)).max(20).default([]),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export type TripPackageFormData = z.infer<typeof tripPackageFormSchema>;
