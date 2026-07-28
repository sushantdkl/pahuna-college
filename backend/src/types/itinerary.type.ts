import { z } from "zod";

export const ItineraryStatusSchema = z.enum([
  "DRAFT",
  "PLANNED",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
]);

export type ItineraryStatus = z.infer<typeof ItineraryStatusSchema>;
