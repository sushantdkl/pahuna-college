import { z } from "zod";
import { ReservationStatusSchema } from "../types/reservation.type";

const mongoId = z.string().trim().regex(/^[a-f\d]{24}$/i, "Invalid MongoDB id");

export const CreateReservationDTO = z.object({
  hotelId: mongoId,
  roomTypeId: mongoId,
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  adults: z.coerce.number().int().min(1).max(20),
  children: z.coerce.number().int().min(0).max(20).default(0),
  numberOfRooms: z.coerce.number().int().min(1).max(20),
  guestName: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(40),
  specialRequests: z.string().trim().max(3000).optional(),
}).refine((payload) => payload.checkOut > payload.checkIn, {
  message: "Check-out must be after check-in",
  path: ["checkOut"],
});

export type CreateReservationDTO = z.infer<typeof CreateReservationDTO>;

export const UpdateReservationDTO = z.object({
  status: ReservationStatusSchema.optional(),
  internalNotes: z.string().trim().max(5000).optional(),
}).strict().refine(
  (payload) => Object.values(payload).some((value) => value !== undefined),
  "At least one reservation field must be provided",
);

export type UpdateReservationDTO = z.infer<typeof UpdateReservationDTO>;

export const ReservationListQueryDTO = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().optional(),
  status: ReservationStatusSchema.optional(),
  hotelId: mongoId.optional(),
});

export type ReservationListQueryDTO = z.infer<typeof ReservationListQueryDTO>;
