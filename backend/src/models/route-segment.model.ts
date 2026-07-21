import mongoose, { Document, Schema } from "mongoose";

export type TravelMode = "FLIGHT" | "BUS" | "JEEP" | "WALK" | "TREK" | "MIXED";
export type RouteReliability = "HIGH" | "MEDIUM" | "LOW";

export interface IRouteSegment extends Document {
  _id: mongoose.Types.ObjectId;
  from: string;
  to: string;
  slug: string;
  mode: TravelMode;
  distanceKm?: number;
  durationMin?: number;
  durationMax?: number;
  costMin?: number;
  costMax?: number;
  currency: string;
  seasonality?: string;
  reliability: RouteReliability;
  notes?: string;
  riskNotes?: string;
  recommendedStopover?: string;
  requiresConfirmation: boolean;
  active: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RouteSegmentMongoSchema: Schema<IRouteSegment> = new Schema(
  {
    from: { type: String, required: true, trim: true, maxlength: 160, index: true },
    to: { type: String, required: true, trim: true, maxlength: 160, index: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 220,
    },
    mode: {
      type: String,
      enum: ["FLIGHT", "BUS", "JEEP", "WALK", "TREK", "MIXED"],
      required: true,
      index: true,
    },
    distanceKm: { type: Number, min: 0 },
    durationMin: { type: Number, min: 0 },
    durationMax: { type: Number, min: 0 },
    costMin: { type: Number, min: 0 },
    costMax: { type: Number, min: 0 },
    currency: { type: String, default: "NPR", trim: true, maxlength: 12 },
    seasonality: { type: String, trim: true, maxlength: 160 },
    reliability: {
      type: String,
      enum: ["HIGH", "MEDIUM", "LOW"],
      default: "MEDIUM",
      index: true,
    },
    notes: { type: String, trim: true, maxlength: 2400 },
    riskNotes: { type: String, trim: true, maxlength: 2000 },
    recommendedStopover: { type: String, trim: true, maxlength: 180 },
    requiresConfirmation: { type: Boolean, default: true, index: true },
    active: { type: Boolean, default: true, index: true },
    featured: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

RouteSegmentMongoSchema.index({ featured: -1, createdAt: -1 });
RouteSegmentMongoSchema.index({
  from: "text",
  to: "text",
  slug: "text",
  mode: "text",
  notes: "text",
  riskNotes: "text",
  seasonality: "text",
});

export const RouteSegmentModel = mongoose.model<IRouteSegment>(
  "RouteSegment",
  RouteSegmentMongoSchema,
);
