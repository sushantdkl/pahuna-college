import mongoose, { Document, Schema } from "mongoose";
import { ConsultingLeadStatus } from "../types/consulting.type";

export interface IConsultingLead extends Document {
  _id: mongoose.Types.ObjectId;
  serviceId?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  businessName?: string;
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
        "WON",
        "LOST",
        "CLOSED",
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
  message: "text",
  status: "text",
  response: "text",
});

export const ConsultingLeadModel = mongoose.model<IConsultingLead>(
  "ConsultingLead",
  ConsultingLeadMongoSchema,
);
