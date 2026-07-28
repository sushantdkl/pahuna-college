import { z } from "zod";
import { HotelSchema } from "../types/hotel.type";

export const AdminCreateHotelDTO = HotelSchema.refine(
  (hotel) => hotel.contactPhone || hotel.email,
  {
    message: "Contact phone or email is required",
    path: ["contactPhone"],
  },
);

export type AdminCreateHotelDTO = z.infer<typeof AdminCreateHotelDTO>;

export const AdminUpdateHotelDTO = HotelSchema.partial().refine(
  (hotel) => {
    if (hotel.email === "") return true;
    return true;
  },
  { message: "Invalid hotel update" },
);

export type AdminUpdateHotelDTO = z.infer<typeof AdminUpdateHotelDTO>;
