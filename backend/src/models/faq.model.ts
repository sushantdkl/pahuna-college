import mongoose, { Document, Schema } from "mongoose";

export interface IFAQ extends Document {
  _id: mongoose.Types.ObjectId;
  question: string;
  answer: string;
  category: string;
  isPublished: boolean;
  sortOrder: number;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FAQMongoSchema: Schema<IFAQ> = new Schema(
  {
    question: { type: String, required: true, trim: true, maxlength: 400 },
    answer: { type: String, required: true, trim: true, maxlength: 5000 },
    category: { type: String, required: true, trim: true, maxlength: 100, index: true },
    isPublished: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

FAQMongoSchema.index({ sortOrder: 1, createdAt: -1 });
FAQMongoSchema.index({ question: "text", answer: "text", category: "text" });

export const FAQModel = mongoose.model<IFAQ>("FAQ", FAQMongoSchema);
