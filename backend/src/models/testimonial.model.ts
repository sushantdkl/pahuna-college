import mongoose, { Document, Schema } from "mongoose";

export interface ITestimonial extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  role?: string;
  company?: string;
  quote: string;
  rating: number;
  avatar?: string;
  category?: string;
  serviceSlug?: string;
  isPublished: boolean;
  sortOrder: number;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialMongoSchema: Schema<ITestimonial> = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    role: { type: String, trim: true, maxlength: 120 },
    company: { type: String, trim: true, maxlength: 160 },
    quote: { type: String, required: true, trim: true, maxlength: 3000 },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    avatar: { type: String, trim: true, maxlength: 300 },
    category: { type: String, trim: true, maxlength: 100, index: true },
    serviceSlug: { type: String, trim: true, maxlength: 160, index: true },
    isPublished: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

TestimonialMongoSchema.index({ sortOrder: 1, createdAt: -1 });
TestimonialMongoSchema.index({
  name: "text",
  role: "text",
  company: "text",
  quote: "text",
  category: "text",
  serviceSlug: "text",
});

export const TestimonialModel = mongoose.model<ITestimonial>(
  "Testimonial",
  TestimonialMongoSchema,
);
