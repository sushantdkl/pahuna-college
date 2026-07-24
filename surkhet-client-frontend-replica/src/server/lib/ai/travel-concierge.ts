import { z } from "zod";

export const STARTING_CITIES = ["Kathmandu", "Nepalgunj", "Surkhet"];
export const DESTINATION_INTERESTS = ["Surkhet", "Rara", "Dailekh", "Dolpa", "Jumla"];
export const TRAVELER_TYPES = ["Solo", "Couple", "Family", "Friends"];
export const INTEREST_OPTIONS = ["Nature", "Culture", "Food", "Adventure", "Heritage"];
export const TRANSPORT_PREFERENCES = ["Flight", "Bus", "Jeep", "Mixed"];
export const STAY_PREFERENCES = ["Budget", "Standard", "Premium", "Homestay"];
export const FITNESS_LEVELS = ["Easy", "Moderate", "Hard"];

export const travelConciergeRequestSchema = z.object({
  mode: z.string().optional(),
  plan: z.string().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  startingCity: z.string().optional(),
  destination: z.string().optional(),
  days: z.coerce.number().optional(),
  travelers: z.coerce.number().optional(),
  budget: z.string().optional(),
  travelerType: z.string().optional(),
  interests: z.array(z.string()).optional(),
  transportPreference: z.string().optional(),
  stayPreference: z.string().optional(),
  fitnessLevel: z.string().optional(),
}).passthrough();

export const travelConciergeResponseSchema: z.ZodType<any> = z.any();
export type TravelConciergeResponse = any;
