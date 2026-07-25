import mongoose, { Document, Schema } from "mongoose";

export interface IRoomType extends Document {
  _id: mongoose.Types.ObjectId;
  hotelId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  capacity: number;
  beds?: string;
  pricePerNight: number;
  totalRooms: number;
  amenities: string[];
  images: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RoomTypeSchema = new Schema<IRoomType>(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: "Hotel", required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    capacity: { type: Number, required: true, min: 1 },
    beds: { type: String, trim: true },
    pricePerNight: { type: Number, required: true, min: 0 },
    totalRooms: { type: Number, required: true, min: 1 },
    amenities: { type: [String], default: [] },
    images: { type: [String], default: [] },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

RoomTypeSchema.index({ hotelId: 1, name: 1 }, { unique: true });

export const RoomTypeModel = mongoose.model<IRoomType>("RoomType", RoomTypeSchema);
