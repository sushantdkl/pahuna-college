import mongoose, { Document, Schema } from "mongoose";
import { TrainingEnrollmentStatus } from "../types/training.type";

export interface ITrainingEnrollment extends Document {
  _id: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  message?: string;
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
    message: {
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
  email: "text",
  phone: "text",
  message: "text",
  status: "text",
});

export const TrainingEnrollmentModel =
  mongoose.model<ITrainingEnrollment>(
    "TrainingEnrollment",
    TrainingEnrollmentMongoSchema,
  );
