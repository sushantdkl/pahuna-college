import mongoose, { Document, Schema } from "mongoose";
import { ContactMessageType } from "../types/contact-message.type";

export interface IContactMessage
  extends Omit<ContactMessageType, "respondedBy">,
    Document {
  _id: mongoose.Types.ObjectId;
  respondedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageMongoSchema: Schema<IContactMessage> = new Schema(
  {
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
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 40,
    },
    subject: {
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
    status: {
      type: String,
      enum: ["NEW", "READ", "RESPONDED", "CLOSED"],
      default: "NEW",
      index: true,
    },
    response: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
    respondedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

ContactMessageMongoSchema.index({ createdAt: -1 });
ContactMessageMongoSchema.index({
  name: "text",
  email: "text",
  phone: "text",
  subject: "text",
  message: "text",
});

export const ContactMessageModel = mongoose.model<IContactMessage>(
  "ContactMessage",
  ContactMessageMongoSchema,
);
