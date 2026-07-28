import { z } from "zod";
import { DestinationSchema } from "../types/destination.type";

export const AdminCreateDestinationDTO = DestinationSchema;

export type AdminCreateDestinationDTO = z.infer<typeof AdminCreateDestinationDTO>;

export const AdminUpdateDestinationDTO = DestinationSchema.partial();

export type AdminUpdateDestinationDTO = z.infer<typeof AdminUpdateDestinationDTO>;
