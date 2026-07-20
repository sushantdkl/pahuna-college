import { z } from "zod";

const mongoId = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Please select a valid destination");

const optionalDate = z.string().trim().optional();

export const itineraryStatusSchema = z.enum([
  "DRAFT",
  "PLANNED",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
]);

export const itineraryFormSchema = z
  .object({
    title: z.string().trim().min(1, "Trip title is required").max(160),
    description: z.string().trim().max(5000).optional(),
    destinationId: mongoId,
    startDate: optionalDate,
    endDate: optionalDate,
    totalDays: z.number().int().positive().optional(),
    budget: z.number().nonnegative().optional(),
    hotelIds: z.array(mongoId).max(50).default([]),
    experienceIds: z.array(mongoId).max(50).default([]),
    status: itineraryStatusSchema.default("DRAFT"),
    isPublic: z.boolean().default(false),
  })
  .refine(
    (payload) =>
      !payload.startDate ||
      !payload.endDate ||
      new Date(payload.endDate) >= new Date(payload.startDate),
    {
      message: "End date cannot be before start date",
      path: ["endDate"],
    },
  );

export type ItineraryFormData = z.infer<typeof itineraryFormSchema>;
export type ItineraryStatus = z.infer<typeof itineraryStatusSchema>;
