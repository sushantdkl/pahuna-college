import mongoose, { Document, Schema } from "mongoose";

export interface IConsultingService extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  category?: string;
  price?: string;
  duration?: string;
  deliverables: string[];
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ConsultingServiceMongoSchema: Schema<IConsultingService> = new Schema(
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
    price: {
      type: String,
      trim: true,
      maxlength: 120,
    },
    duration: {
      type: String,
      trim: true,
      maxlength: 80,
    },
    deliverables: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      trim: true,
      maxlength: 500,
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

ConsultingServiceMongoSchema.index({ createdAt: -1 });
ConsultingServiceMongoSchema.index({
  title: "text",
  slug: "text",
  description: "text",
  category: "text",
  deliverables: "text",
});

export const ConsultingServiceModel =
  mongoose.model<IConsultingService>(
    "ConsultingService",
    ConsultingServiceMongoSchema,
  );
