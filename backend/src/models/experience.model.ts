import mongoose, { Document, Schema } from "mongoose";
import { ExperienceType } from "../types/experience.type";

export interface IExperience extends Omit<ExperienceType, "providerId">, Document {
  _id: mongoose.Types.ObjectId;
  providerId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceMongoSchema: Schema<IExperience> = new Schema(
  {
    providerId: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    price: Number,
    duration: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    latitude: Number,
    longitude: Number,
    maxParticipants: Number,
    images: {
      type: [String],
      default: [],
    },
    rating: Number,
    reviewCount: Number,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

ExperienceMongoSchema.index({
  name: "text",
  description: "text",
  category: "text",
  location: "text",
});

export const ExperienceModel = mongoose.model<IExperience>(
  "Experience",
  ExperienceMongoSchema,
);
