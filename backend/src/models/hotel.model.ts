import mongoose, { Document, Schema } from "mongoose";
import { HotelType } from "../types/hotel.type";

export interface IHotel extends Omit<HotelType, "ownerId">, Document {
  _id: mongoose.Types.ObjectId;
  ownerId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const HotelMongoSchema: Schema<IHotel> = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
    },
    latitude: Number,
    longitude: Number,
    propertyType: {
      type: String,
      required: true,
      trim: true,
    },
    starRating: Number,
    priceMin: Number,
    priceMax: Number,
    amenities: {
      type: [String],
      default: [],
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    totalRooms: Number,
    availableRooms: Number,
  },
  {
    timestamps: true,
  },
);

HotelMongoSchema.index({
  name: "text",
  address: "text",
  email: "text",
  contactPhone: "text",
  propertyType: "text",
});

export const HotelModel = mongoose.model<IHotel>("Hotel", HotelMongoSchema);
