import { z } from "zod";

const optionalNumberInput = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) return undefined;
    return Number(value);
  },
  z.number().finite().optional(),
);

export const adminExperienceFormSchema = z.object({
  providerId: z.string().trim().optional(),
  name: z.string().trim().min(1, "Experience name is required"),
  description: z.string().trim().min(1, "Description is required"),
  category: z.string().trim().min(1, "Category is required"),
  price: optionalNumberInput,
  duration: z.string().trim().optional(),
  location: z.string().trim().min(1, "Location is required"),
  latitude: optionalNumberInput,
  longitude: optionalNumberInput,
  maxParticipants: optionalNumberInput,
  images: z.array(z.string()).default([]),
  rating: optionalNumberInput,
  reviewCount: optionalNumberInput,
  isActive: z.boolean().default(true),
});

export type AdminExperienceFormData = z.infer<typeof adminExperienceFormSchema>;
