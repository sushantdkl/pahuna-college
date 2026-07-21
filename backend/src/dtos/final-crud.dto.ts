import { z } from "zod";

const optionalText = (maximum: number) =>
  z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.string().trim().max(maximum).optional(),
  );

const optionalNumber = z.preprocess(
  (value) => (value === "" || value === null ? undefined : value),
  z.coerce.number().min(0).optional(),
);

const optionalBoolean = z.preprocess(
  (value) =>
    value === "" || value === undefined
      ? undefined
      : value === "true" || value === true,
  z.boolean().optional(),
);

const textList = z.preprocess((value) => {
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

const localImageList = z.preprocess((value) => {
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

const slugField = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must use lowercase words and hyphens")
  .max(220)
  .optional();

const nonEmptyUpdate = (payload: Record<string, unknown>) =>
  Object.values(payload).some((value) => value !== undefined);

const listQuery = {
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().optional(),
};

const foodProviderFields = z.object({
  name: z.string().trim().min(1, "Name is required").max(180),
  slug: slugField,
  type: z.string().trim().min(1, "Food type is required").max(80),
  district: z.string().trim().min(1, "District is required").max(100),
  municipality: optionalText(120),
  area: z.string().trim().min(1, "Area is required").max(160),
  address: optionalText(300),
  latitude: z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.coerce.number().min(-90).max(90).optional(),
  ),
  longitude: z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.coerce.number().min(-180).max(180).optional(),
  ),
  shortDescription: z.string().trim().min(1, "Short description is required").max(500),
  longDescription: optionalText(6000),
  cuisines: textList.default([]),
  services: textList.default([]),
  features: textList.default([]),
  priceLevel: optionalText(80),
  openingHours: optionalText(160),
  phone: optionalText(40),
  email: optionalText(180),
  website: optionalText(300),
  sourceUrl: optionalText(300),
  sourceLabel: optionalText(120),
  images: localImageList.default([]),
  rating: z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.coerce.number().min(0).max(5).optional(),
  ),
  reviewCount: z.coerce.number().min(0).default(0),
  verificationStatus: z
    .enum(["PENDING", "VERIFIED", "PARTNER", "REJECTED"])
    .default("PENDING"),
  consentStatus: optionalText(80),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
});

export const CreateFoodProviderDTO = foodProviderFields;
export type CreateFoodProviderDTO = z.infer<typeof CreateFoodProviderDTO>;

export const UpdateFoodProviderDTO = foodProviderFields
  .partial()
  .refine(nonEmptyUpdate, "At least one food provider field must be provided");
export type UpdateFoodProviderDTO = z.infer<typeof UpdateFoodProviderDTO>;

export const FoodProviderListQueryDTO = z.object({
  ...listQuery,
  type: z.string().trim().optional(),
  area: z.string().trim().optional(),
  district: z.string().trim().optional(),
  featured: optionalBoolean,
  active: optionalBoolean,
  verificationStatus: z.enum(["PENDING", "VERIFIED", "PARTNER", "REJECTED"]).optional(),
});
export type FoodProviderListQueryDTO = z.infer<typeof FoodProviderListQueryDTO>;

const transportRouteFields = z.object({
  fromLocation: z.string().trim().min(1, "From location is required").max(160),
  toLocation: z.string().trim().min(1, "To location is required").max(160),
  mode: z.string().trim().min(1, "Mode is required").max(80),
  durationHours: optionalNumber,
  costMin: optionalNumber,
  costMax: optionalNumber,
  frequency: optionalText(180),
  notes: optionalText(2000),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().default(0),
});

export const CreateTransportRouteDTO = transportRouteFields.refine(
  (payload) =>
    payload.costMin === undefined ||
    payload.costMax === undefined ||
    payload.costMax >= payload.costMin,
  "Maximum route cost cannot be lower than minimum route cost",
);
export type CreateTransportRouteDTO = z.infer<typeof CreateTransportRouteDTO>;

export const UpdateTransportRouteDTO = transportRouteFields
  .partial()
  .refine(
    (payload) =>
      payload.costMin === undefined ||
      payload.costMax === undefined ||
      payload.costMax >= payload.costMin,
    "Maximum route cost cannot be lower than minimum route cost",
  )
  .refine(nonEmptyUpdate, "At least one transport route field must be provided");
export type UpdateTransportRouteDTO = z.infer<typeof UpdateTransportRouteDTO>;

const routeSegmentFields = z.object({
  from: z.string().trim().min(1, "From location is required").max(160),
  to: z.string().trim().min(1, "To location is required").max(160),
  slug: slugField,
  mode: z.enum(["FLIGHT", "BUS", "JEEP", "WALK", "TREK", "MIXED"]),
  distanceKm: optionalNumber,
  durationMin: optionalNumber,
  durationMax: optionalNumber,
  costMin: optionalNumber,
  costMax: optionalNumber,
  currency: z.string().trim().max(12).default("NPR"),
  seasonality: optionalText(160),
  reliability: z.enum(["HIGH", "MEDIUM", "LOW"]).default("MEDIUM"),
  notes: optionalText(2400),
  riskNotes: optionalText(2000),
  recommendedStopover: optionalText(180),
  requiresConfirmation: z.boolean().default(true),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
});

const validRouteSegmentRanges = (payload: Partial<z.infer<typeof routeSegmentFields>>) =>
  (payload.durationMin === undefined ||
    payload.durationMax === undefined ||
    payload.durationMax >= payload.durationMin) &&
  (payload.costMin === undefined ||
    payload.costMax === undefined ||
    payload.costMax >= payload.costMin);

export const CreateRouteSegmentDTO = routeSegmentFields.refine(
  validRouteSegmentRanges,
  "Maximum duration/cost cannot be lower than minimum value",
);
export type CreateRouteSegmentDTO = z.infer<typeof CreateRouteSegmentDTO>;

export const UpdateRouteSegmentDTO = routeSegmentFields
  .partial()
  .refine(validRouteSegmentRanges, "Maximum duration/cost cannot be lower than minimum value")
  .refine(nonEmptyUpdate, "At least one route segment field must be provided");
export type UpdateRouteSegmentDTO = z.infer<typeof UpdateRouteSegmentDTO>;

export const RouteListQueryDTO = z.object({
  ...listQuery,
  mode: z.string().trim().optional(),
  active: optionalBoolean,
  featured: optionalBoolean,
});
export type RouteListQueryDTO = z.infer<typeof RouteListQueryDTO>;
