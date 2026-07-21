import mongoose, { Document, Schema } from "mongoose";
import { TrainingCourseStatus } from "../types/training.type";

export interface ITrainingCourse extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  category?: string;
  duration?: string;
  price?: number;
  level?: string;
  mode?: string;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  maxParticipants?: number;
  image?: string;
  status: TrainingCourseStatus;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TrainingCourseMongoSchema: Schema<ITrainingCourse> = new Schema(
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
      maxlength: 10000,
    },
    category: {
      type: String,
      trim: true,
      maxlength: 100,
      index: true,
    },
    duration: {
      type: String,
      trim: true,
      maxlength: 80,
    },
    price: {
      type: Number,
      min: 0,
    },
    level: {
      type: String,
      trim: true,
      maxlength: 80,
    },
    mode: {
      type: String,
      trim: true,
      maxlength: 80,
    },
    location: {
      type: String,
      trim: true,
      maxlength: 160,
    },
    startDate: Date,
    endDate: Date,
    maxParticipants: {
      type: Number,
      min: 1,
    },
    image: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      default: "DRAFT",
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

TrainingCourseMongoSchema.index({ createdAt: -1 });
TrainingCourseMongoSchema.index({
  title: "text",
  slug: "text",
  description: "text",
  category: "text",
  level: "text",
  mode: "text",
  location: "text",
});

export const TrainingCourseModel = mongoose.model<ITrainingCourse>(
  "TrainingCourse",
  TrainingCourseMongoSchema,
);
