import mongoose, { Document, Schema } from "mongoose";
import { InquiryType } from "../types/inquiry.type";

export interface IInquiry
  extends Omit<
      InquiryType,
      | "userId"
      | "hotelId"
      | "tripPackageId"
      | "destinationId"
      | "experienceId"
      | "itineraryId"
      | "assignedTo"
    >,
    Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  hotelId?: mongoose.Types.ObjectId;
  tripPackageId?: mongoose.Types.ObjectId;
  // Related catalogue record the inquiry was raised from in the mobile app.
  destinationId?: mongoose.Types.ObjectId;
  experienceId?: mongoose.Types.ObjectId;
  itineraryId?: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const InquiryMongoSchema: Schema<IInquiry> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    hotelId: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      index: true,
    },
    tripPackageId: {
      type: Schema.Types.ObjectId,
      ref: "TripPackage",
      index: true,
    },
    destinationId: {
      type: Schema.Types.ObjectId,
      ref: "Destination",
      index: true,
    },
    experienceId: {
      type: Schema.Types.ObjectId,
      ref: "Experience",
      index: true,
    },
    itineraryId: {
      type: Schema.Types.ObjectId,
      ref: "Itinerary",
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 160,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    inquiryType: {
      type: String,
      enum: [
        "HOTEL",
        "AVAILABILITY",
        "BOOKING",
        "RESERVATION",
        "DESTINATION",
        "EXPERIENCE",
        "ITINERARY",
        "TRAVEL_SUPPORT",
        "GENERAL",
      ],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["NEW", "IN_PROGRESS", "RESPONDED", "CLOSED"],
      default: "NEW",
      index: true,
    },
    response: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

InquiryMongoSchema.index({ createdAt: -1 });
InquiryMongoSchema.index({ title: "text", message: "text" });

export const InquiryModel = mongoose.model<IInquiry>(
  "Inquiry",
  InquiryMongoSchema,
);
