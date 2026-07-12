import mongoose, { Document, Schema } from "mongoose";
import { DestinationType } from "../types/destination.type";

export interface IDestination extends DestinationType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DestinationMongoSchema: Schema<IDestination> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    attractions: {
      type: [String],
      default: [],
    },
    bestTimeToVisit: {
      type: String,
      trim: true,
    },
    distanceFromSurkhetKm: Number,
    latitude: Number,
    longitude: Number,
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

DestinationMongoSchema.index({
  name: "text",
  slug: "text",
  description: "text",
  attractions: "text",
  category: "text",
  district: "text",
});

export const DestinationModel = mongoose.model<IDestination>(
  "Destination",
  DestinationMongoSchema,
);
