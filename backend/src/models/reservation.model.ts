import mongoose, { Document, Schema } from "mongoose";
import { ReservationStatus } from "../types/reservation.type";

export interface IReservation extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  hotelId: mongoose.Types.ObjectId;
  roomTypeId: mongoose.Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  numberOfRooms: number;
  guestName: string;
  email: string;
  phone: string;
  specialRequests?: string;
  estimatedTotal: number;
  status: ReservationStatus;
  internalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema = new Schema<IReservation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    hotelId: { type: Schema.Types.ObjectId, ref: "Hotel", required: true, index: true },
    roomTypeId: { type: Schema.Types.ObjectId, ref: "RoomType", required: true, index: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    adults: { type: Number, required: true, min: 1 },
    children: { type: Number, default: 0, min: 0 },
    numberOfRooms: { type: Number, required: true, min: 1 },
    guestName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    specialRequests: { type: String, trim: true },
    estimatedTotal: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "REJECTED", "CANCELLED", "COMPLETED"],
      default: "PENDING",
      index: true,
    },
    internalNotes: { type: String, trim: true },
  },
  { timestamps: true },
);

ReservationSchema.index({ userId: 1, createdAt: -1 });
ReservationSchema.index({ hotelId: 1, checkIn: 1, checkOut: 1 });

export const ReservationModel = mongoose.model<IReservation>("Reservation", ReservationSchema);
