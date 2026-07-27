import { z } from "zod";

export const ReservationStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "REJECTED",
  "CANCELLED",
  "COMPLETED",
]);

export type ReservationStatus = z.infer<typeof ReservationStatusSchema>;
