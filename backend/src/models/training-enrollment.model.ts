import mongoose, { Document, Schema } from "mongoose";
import { TrainingEnrollmentStatus } from "../types/training.type";

export interface ITrainingEnrollment extends Document {
  _id: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  name: string;
  fullName?: string;
  email: string;
  phone: string;
  age?: number;
  education?: string;
  educationLevel?: string;
  experience?: string;
  priorExperience?: string;
  message?: string;
  motivation?: string;
  status: TrainingEnrollmentStatus;
  response?: string;
  enrolledAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TrainingEnrollmentMongoSchema: Schema<ITrainingEnrollment> = new Schema(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "TrainingCourse",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    fullName: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40,
    },
    age: {
      type: Number,
      min: 0,
      max: 120,
    },
    education: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    educationLevel: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    experience: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    priorExperience: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 3000,
    },
    motivation: {
      type: String,
      trim: true,
      maxlength: 3000,
    },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"],
      default: "PENDING",
      index: true,
    },
    response: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

TrainingEnrollmentMongoSchema.index({ createdAt: -1 });
TrainingEnrollmentMongoSchema.index({
  name: "text",
  fullName: "text",
  email: "text",
  phone: "text",
  education: "text",
  educationLevel: "text",
  experience: "text",
  priorExperience: "text",
  message: "text",
  motivation: "text",
  status: "text",
});

export const TrainingEnrollmentModel =
  mongoose.model<ITrainingEnrollment>(
    "TrainingEnrollment",
    TrainingEnrollmentMongoSchema,
  );
