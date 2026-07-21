import mongoose, { Document, Schema } from "mongoose";

export type FoodProviderVerificationStatus =
  | "PENDING"
  | "VERIFIED"
  | "PARTNER"
  | "REJECTED";

export interface IFoodProvider extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  type: string;
  district: string;
  municipality?: string;
  area: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  shortDescription: string;
  longDescription?: string;
  cuisines: string[];
  services: string[];
  features: string[];
  priceLevel?: string;
  openingHours?: string;
  phone?: string;
  email?: string;
  website?: string;
  sourceUrl?: string;
  sourceLabel?: string;
  images: string[];
  rating?: number;
  reviewCount?: number;
  verificationStatus: FoodProviderVerificationStatus;
  consentStatus?: string;
  featured: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FoodProviderMongoSchema: Schema<IFoodProvider> = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 180 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 220,
    },
    type: { type: String, required: true, trim: true, maxlength: 80, index: true },
    district: { type: String, required: true, trim: true, maxlength: 100, index: true },
    municipality: { type: String, trim: true, maxlength: 120 },
    area: { type: String, required: true, trim: true, maxlength: 160, index: true },
    address: { type: String, trim: true, maxlength: 300 },
    latitude: { type: Number, min: -90, max: 90 },
    longitude: { type: Number, min: -180, max: 180 },
    shortDescription: { type: String, required: true, trim: true, maxlength: 500 },
    longDescription: { type: String, trim: true, maxlength: 6000 },
    cuisines: { type: [String], default: [] },
    services: { type: [String], default: [] },
    features: { type: [String], default: [] },
    priceLevel: { type: String, trim: true, maxlength: 80 },
    openingHours: { type: String, trim: true, maxlength: 160 },
    phone: { type: String, trim: true, maxlength: 40 },
    email: { type: String, trim: true, lowercase: true, maxlength: 180 },
    website: { type: String, trim: true, maxlength: 300 },
    sourceUrl: { type: String, trim: true, maxlength: 300 },
    sourceLabel: { type: String, trim: true, maxlength: 120 },
    images: { type: [String], default: [] },
    rating: { type: Number, min: 0, max: 5 },
    reviewCount: { type: Number, min: 0, default: 0 },
    verificationStatus: {
      type: String,
      enum: ["PENDING", "VERIFIED", "PARTNER", "REJECTED"],
      default: "PENDING",
      index: true,
    },
    consentStatus: { type: String, trim: true, maxlength: 80 },
    featured: { type: Boolean, default: false, index: true },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

FoodProviderMongoSchema.index({ createdAt: -1 });
FoodProviderMongoSchema.index({
  name: "text",
  slug: "text",
  type: "text",
  district: "text",
  area: "text",
  shortDescription: "text",
  longDescription: "text",
  cuisines: "text",
  services: "text",
  features: "text",
});

export const FoodProviderModel = mongoose.model<IFoodProvider>(
  "FoodProvider",
  FoodProviderMongoSchema,
);
