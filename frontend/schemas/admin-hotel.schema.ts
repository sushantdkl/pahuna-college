import { z } from "zod";

const optionalNumberInput = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) return undefined;
    return Number(value);
  },
  z.number().finite().optional(),
);

export const adminHotelFormSchema = z
  .object({
    name: z.string().trim().min(1, "Hotel name is required"),
    description: z.string().trim().min(1, "Description is required"),
    address: z.string().trim().min(1, "Address is required"),
    district: z.string().trim().optional(),
    latitude: optionalNumberInput,
    longitude: optionalNumberInput,
    propertyType: z.string().trim().min(1, "Property type is required"),
    starRating: optionalNumberInput,
    priceMin: optionalNumberInput,
    priceMax: optionalNumberInput,
    amenities: z.array(z.string()).default([]),
    contactPhone: z.string().trim().optional(),
    email: z.string().trim().email("Invalid email address").optional().or(z.literal("")),
    images: z.array(z.string()).default([]),
    isVerified: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
    isActive: z.boolean().default(true),
    totalRooms: optionalNumberInput,
    availableRooms: optionalNumberInput,
  })
  .refine((hotel) => hotel.contactPhone || hotel.email, {
    message: "Contact phone or email is required",
    path: ["contactPhone"],
  });

export type AdminHotelFormData = z.infer<typeof adminHotelFormSchema>;
