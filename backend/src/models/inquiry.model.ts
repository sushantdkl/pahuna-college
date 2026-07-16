import mongoose, { Document, Schema } from "mongoose";
import { InquiryType } from "../types/inquiry.type";

export interface IInquiry
  extends Omit<InquiryType, "userId" | "hotelId" | "assignedTo">,
    Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  hotelId?: mongoose.Types.ObjectId;
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
