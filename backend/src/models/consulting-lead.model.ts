import mongoose, { Document, Schema } from "mongoose";
import { ConsultingLeadStatus } from "../types/consulting.type";

export interface IConsultingLead extends Document {
  _id: mongoose.Types.ObjectId;
  serviceId?: mongoose.Types.ObjectId;
  // Set when a signed-in Pahuna mobile user submits the request, so it can be
  // listed back to them. Website guests keep leaving it empty.
  userId?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  businessName?: string;
  contactName?: string;
  businessType?: string;
  businessStage?: string;
  stage?: string;
  businessSize?: string;
  location?: string;
  serviceType?: string;
  timeline?: string;
  budget?: string;
  budgetRange?: string;
  message: string;
  status: ConsultingLeadStatus;
  response?: string;
  assignedTo?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ConsultingLeadMongoSchema: Schema<IConsultingLead> = new Schema(
  {
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "ConsultingService",
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
    businessName: {
      type: String,
      trim: true,
      maxlength: 160,
    },
    contactName: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    businessType: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    businessStage: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    stage: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    businessSize: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    location: {
      type: String,
      trim: true,
      maxlength: 160,
    },
    serviceType: {
      type: String,
      trim: true,
      maxlength: 160,
    },
    timeline: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    budget: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    budgetRange: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    status: {
      type: String,
      enum: [
        "NEW",
        "CONTACTED",
        "QUALIFIED",
        "PROPOSAL_SENT",
        "NEGOTIATION",
        "WON",
        "LOST",
      ],
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
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

ConsultingLeadMongoSchema.index({ createdAt: -1 });
ConsultingLeadMongoSchema.index({
  name: "text",
  email: "text",
  phone: "text",
  businessName: "text",
  contactName: "text",
  businessType: "text",
  businessStage: "text",
  stage: "text",
  businessSize: "text",
  location: "text",
  serviceType: "text",
  timeline: "text",
  budget: "text",
  budgetRange: "text",
  message: "text",
  status: "text",
  response: "text",
});

export const ConsultingLeadModel = mongoose.model<IConsultingLead>(
  "ConsultingLead",
  ConsultingLeadMongoSchema,
);
