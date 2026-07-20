import mongoose, { Document, Schema } from "mongoose";
import { PartnerApplicationType } from "../types/partner-application.type";

export interface IPartnerApplication
  extends Omit<PartnerApplicationType, "reviewedBy">,
    Document {
  _id: mongoose.Types.ObjectId;
  reviewedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PartnerApplicationMongoSchema: Schema<IPartnerApplication> = new Schema(
  {
    status: {
      type: String,
      enum: ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"],
      default: "PENDING",
      index: true,
    },
    businessName: { type: String, required: true, trim: true, maxlength: 160 },
    partnerType: {
      type: String,
      enum: ["HOTEL", "RESORT", "RESTAURANT", "TRAVEL_AGENCY", "TRANSPORT", "OTHER"],
      required: true,
      index: true,
    },
    ownerName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, required: true, trim: true, maxlength: 40 },
    address: { type: String, trim: true, maxlength: 300 },
    website: { type: String, trim: true, maxlength: 500 },
    totalRooms: { type: Number, min: 0, max: 10000 },
    currentRevenue: { type: String, trim: true, maxlength: 120 },
    existingOnline: { type: Boolean, default: false },
    challenges: { type: String, trim: true, maxlength: 3000 },
    goals: { type: String, trim: true, maxlength: 3000 },
    notes: { type: String, trim: true, maxlength: 5000 },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
  },
  { timestamps: true },
);

PartnerApplicationMongoSchema.index({ createdAt: -1 });
PartnerApplicationMongoSchema.index({
  businessName: "text",
  ownerName: "text",
  email: "text",
  phone: "text",
  address: "text",
  website: "text",
});

export const PartnerApplicationModel =
  mongoose.models.PartnerApplication ||
  mongoose.model<IPartnerApplication>(
    "PartnerApplication",
    PartnerApplicationMongoSchema,
  );
