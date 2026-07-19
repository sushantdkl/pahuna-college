import mongoose, { Document, Schema } from "mongoose";
import { ItineraryStatus } from "../types/itinerary.type";

export interface IItinerary extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  destinationId: mongoose.Types.ObjectId;
  startDate?: Date;
  endDate?: Date;
  totalDays?: number;
  budget?: number;
  hotelIds: mongoose.Types.ObjectId[];
  experienceIds: mongoose.Types.ObjectId[];
  status: ItineraryStatus;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ItineraryMongoSchema: Schema<IItinerary> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
    destinationId: {
      type: Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
      index: true,
    },
    startDate: Date,
    endDate: Date,
    totalDays: {
      type: Number,
      min: 1,
    },
    budget: {
      type: Number,
      min: 0,
    },
    hotelIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "Hotel" }],
      default: [],
    },
    experienceIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "Experience" }],
      default: [],
    },
    status: {
      type: String,
      enum: ["DRAFT", "PLANNED", "CONFIRMED", "CANCELLED", "COMPLETED"],
      default: "DRAFT",
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

ItineraryMongoSchema.index({ createdAt: -1 });
ItineraryMongoSchema.index({ title: "text", description: "text" });

export const ItineraryModel = mongoose.model<IItinerary>(
  "Itinerary",
  ItineraryMongoSchema,
);
