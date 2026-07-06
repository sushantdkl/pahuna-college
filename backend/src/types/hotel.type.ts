import { z } from "zod";

const optionalNumber = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) return undefined;
    return Number(value);
  },
  z.number().finite().optional(),
);

const optionalBoolean = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) return undefined;
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return value.toLowerCase() === "true";
    return Boolean(value);
  },
  z.boolean().optional(),
);

const stringArray = z.preprocess((value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return trimmed.split(",").map((item) => item.trim()).filter(Boolean);
    }
  }

  return [];
}, z.array(z.string().trim().min(1)).default([]));

export const HotelSchema = z.object({
  ownerId: z.string().trim().optional(),
  name: z.string().trim().min(1, "Hotel name is required"),
  description: z.string().trim().min(1, "Description is required"),
  address: z.string().trim().min(1, "Address is required"),
  district: z.string().trim().optional(),
  latitude: optionalNumber,
  longitude: optionalNumber,
  propertyType: z.string().trim().min(1, "Property type is required"),
  starRating: optionalNumber,
  priceMin: optionalNumber,
  priceMax: optionalNumber,
  amenities: stringArray,
  contactPhone: z.string().trim().optional(),
  email: z.string().trim().email("Invalid email address").optional().or(z.literal("")),
  images: stringArray,
  isVerified: optionalBoolean.default(false),
  isFeatured: optionalBoolean.default(false),
  isActive: optionalBoolean.default(true),
  totalRooms: optionalNumber,
  availableRooms: optionalNumber,
});

export type HotelType = z.infer<typeof HotelSchema>;
