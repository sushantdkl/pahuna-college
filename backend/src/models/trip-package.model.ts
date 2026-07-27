import mongoose, { Document, Schema } from "mongoose";

export interface ITripPackage extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  destinationId?: mongoose.Types.ObjectId;
  durationDays?: number;
  price?: number;
  priceMin?: number;
  priceMax?: number;
  itinerary: string[];
  inclusions: string[];
  exclusions: string[];
  highlights: string[];
  difficulty?: string;
  groupSize?: string;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TripPackageMongoSchema: Schema<ITripPackage> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 220,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 12000,
    },
    destinationId: {
      type: Schema.Types.ObjectId,
      ref: "Destination",
      index: true,
    },
    durationDays: {
      type: Number,
      min: 1,
    },
    price: {
      type: Number,
      min: 0,
    },
    priceMin: {
      type: Number,
      min: 0,
    },
    priceMax: {
      type: Number,
      min: 0,
    },
    itinerary: {
      type: [String],
      default: [],
    },
    inclusions: {
      type: [String],
      default: [],
    },
    exclusions: {
      type: [String],
      default: [],
    },
    highlights: {
      type: [String],
      default: [],
    },
    difficulty: {
      type: String,
      trim: true,
      maxlength: 80,
      index: true,
    },
    groupSize: {
      type: String,
      trim: true,
      maxlength: 80,
    },
    images: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

TripPackageMongoSchema.index({ createdAt: -1 });
TripPackageMongoSchema.index({
  title: "text",
  slug: "text",
  description: "text",
  highlights: "text",
  difficulty: "text",
});

export const TripPackageModel = mongoose.model<ITripPackage>(
  "TripPackage",
  TripPackageMongoSchema,
);
