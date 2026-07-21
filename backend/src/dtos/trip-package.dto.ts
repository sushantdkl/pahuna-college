import { z } from "zod";

const optionalText = (maximum: number) =>
  z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.string().trim().max(maximum).optional(),
  );

const stringList = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return value;
}, z.array(z.string().trim().min(1).max(500)).max(80));

const imageList = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return value;
}, z.array(z.string().trim().max(500).refine(
  (item) => item === "" || (item.startsWith("/") && !item.startsWith("//")),
  "Images must be local public paths",
)).max(20));

const optionalNumber = z.preprocess(
  (value) => (value === "" || value === null ? undefined : value),
  z.coerce.number().min(0).optional(),
);

const packageFields = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(180),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must use lowercase words and hyphens")
      .max(220)
      .optional(),
    description: z.string().trim().min(1, "Description is required").max(12000),
    destinationId: optionalText(60),
    durationDays: z.preprocess(
      (value) => (value === "" || value === null ? undefined : value),
      z.coerce.number().int().min(1).optional(),
    ),
    price: optionalNumber,
    priceMin: optionalNumber,
    priceMax: optionalNumber,
    itinerary: stringList.default([]),
    inclusions: stringList.default([]),
    exclusions: stringList.default([]),
    highlights: stringList.default([]),
    difficulty: optionalText(80),
    groupSize: optionalText(80),
    images: imageList.default([]),
    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
  })
  .refine(
    (payload) =>
      payload.priceMin === undefined ||
      payload.priceMax === undefined ||
      payload.priceMax >= payload.priceMin,
    "Maximum price cannot be lower than minimum price",
  );

export const CreateTripPackageDTO = packageFields;
export type CreateTripPackageDTO = z.infer<typeof CreateTripPackageDTO>;

export const UpdateTripPackageDTO = packageFields
  .partial()
  .refine(
    (payload) => Object.values(payload).some((value) => value !== undefined),
    "At least one trip package field must be provided",
  );

export type UpdateTripPackageDTO = z.infer<typeof UpdateTripPackageDTO>;

export const TripPackageListQueryDTO = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(9),
  search: z.string().trim().optional(),
  featured: z
    .preprocess(
      (value) =>
        value === "" || value === undefined ? undefined : value === "true",
      z.boolean().optional(),
    )
    .optional(),
  destinationId: z.string().trim().optional(),
  difficulty: z.string().trim().max(80).optional(),
});

export type TripPackageListQueryDTO = z.infer<
  typeof TripPackageListQueryDTO
>;

export const AdminTripPackageListQueryDTO = TripPackageListQueryDTO.extend({
  limit: z.coerce.number().int().min(1).max(50).default(10),
  active: z
    .preprocess(
      (value) =>
        value === "" || value === undefined ? undefined : value === "true",
      z.boolean().optional(),
    )
    .optional(),
});

export type AdminTripPackageListQueryDTO = z.infer<
  typeof AdminTripPackageListQueryDTO
>;
