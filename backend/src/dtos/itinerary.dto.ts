import { z } from "zod";
import { ItineraryStatusSchema } from "../types/itinerary.type";

export const mongoIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Invalid MongoDB id");

const optionalDate = z.preprocess(
  (value) => (value === "" || value === null ? undefined : value),
  z.coerce.date().optional(),
);

const optionalNumber = z.preprocess(
  (value) =>
    value === "" || value === null || value === undefined
      ? undefined
      : Number(value),
  z.number().finite().nonnegative().optional(),
);

const optionalPositiveInteger = z.preprocess(
  (value) =>
    value === "" || value === null || value === undefined
      ? undefined
      : Number(value),
  z.number().int().positive().optional(),
);

const booleanValue = z.preprocess((value) => {
  if (typeof value === "string") return value.toLowerCase() === "true";
  return value;
}, z.boolean());

const idArray = z.preprocess(
  (value) => {
    if (value === undefined || value === null || value === "") return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
    return value;
  },
  z.array(mongoIdSchema).max(50).default([]),
);

const itineraryFields = z.object({
  title: z.string().trim().min(1, "Title is required").max(160),
  description: z.string().trim().max(5000).optional(),
  destinationId: mongoIdSchema,
  startDate: optionalDate,
  endDate: optionalDate,
  totalDays: optionalPositiveInteger,
  budget: optionalNumber,
  hotelIds: idArray,
  experienceIds: idArray,
  status: ItineraryStatusSchema.default("DRAFT"),
  isPublic: booleanValue.default(false),
});

function datesAreValid(payload: { startDate?: Date; endDate?: Date }) {
  return !payload.startDate || !payload.endDate || payload.endDate >= payload.startDate;
}

export const CreateItineraryDTO = itineraryFields
  .extend({
    status: z.enum(["DRAFT", "PLANNED"]).default("DRAFT"),
  })
  .refine(datesAreValid, {
    message: "End date cannot be before start date",
    path: ["endDate"],
  });

export type CreateItineraryDTO = z.infer<typeof CreateItineraryDTO>;

export const UpdateItineraryDTO = itineraryFields
  .partial()
  .extend({
    status: z.enum(["DRAFT", "PLANNED", "CANCELLED"]).optional(),
  })
  .refine(datesAreValid, {
    message: "End date cannot be before start date",
    path: ["endDate"],
  })
  .refine(
    (payload) => Object.values(payload).some((value) => value !== undefined),
    "At least one itinerary field must be provided",
  );

export type UpdateItineraryDTO = z.infer<typeof UpdateItineraryDTO>;

export const AdminCreateItineraryDTO = itineraryFields
  .extend({ userId: mongoIdSchema })
  .refine(datesAreValid, {
    message: "End date cannot be before start date",
    path: ["endDate"],
  });

export type AdminCreateItineraryDTO = z.infer<
  typeof AdminCreateItineraryDTO
>;

export const AdminUpdateItineraryDTO = itineraryFields
  .partial()
  .refine(datesAreValid, {
    message: "End date cannot be before start date",
    path: ["endDate"],
  })
  .refine(
    (payload) => Object.values(payload).some((value) => value !== undefined),
    "At least one itinerary field must be provided",
  );

export type AdminUpdateItineraryDTO = z.infer<
  typeof AdminUpdateItineraryDTO
>;

export const ItineraryListQueryDTO = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const AdminItineraryListQueryDTO = ItineraryListQueryDTO.extend({
  search: z.string().trim().optional(),
  status: ItineraryStatusSchema.optional(),
  isPublic: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),
  destinationId: mongoIdSchema.optional(),
  userId: mongoIdSchema.optional(),
});

export type AdminItineraryListQueryDTO = z.infer<
  typeof AdminItineraryListQueryDTO
>;
