import mongoose, { Document, Schema } from "mongoose";
import { NewsletterSubscriberType } from "../types/newsletter-subscriber.type";

export interface INewsletterSubscriber
  extends NewsletterSubscriberType,
    Document {
  _id: mongoose.Types.ObjectId;
  subscribedAt: Date;
  unsubscribedAt?: Date | null;
}

const NewsletterSubscriberMongoSchema: Schema<INewsletterSubscriber> =
  new Schema(
    {
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: 254,
      },
      name: {
        type: String,
        trim: true,
        maxlength: 120,
      },
      isActive: {
        type: Boolean,
        default: true,
        index: true,
      },
      subscribedAt: {
        type: Date,
        default: Date.now,
      },
      unsubscribedAt: {
        type: Date,
        default: null,
      },
    },
    {
      versionKey: false,
    },
  );

NewsletterSubscriberMongoSchema.index({ subscribedAt: -1 });
NewsletterSubscriberMongoSchema.index({ name: "text", email: "text" });

export const NewsletterSubscriberModel =
  mongoose.models.NewsletterSubscriber ||
  mongoose.model<INewsletterSubscriber>(
    "NewsletterSubscriber",
    NewsletterSubscriberMongoSchema,
  );
