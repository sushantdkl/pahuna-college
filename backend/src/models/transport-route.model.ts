import mongoose, { Document, Schema } from "mongoose";

export interface ITransportRoute extends Document {
  _id: mongoose.Types.ObjectId;
  fromLocation: string;
  toLocation: string;
  mode: string;
  durationHours?: number;
  costMin?: number;
  costMax?: number;
  frequency?: string;
  notes?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const TransportRouteMongoSchema: Schema<ITransportRoute> = new Schema(
  {
    fromLocation: { type: String, required: true, trim: true, maxlength: 160, index: true },
    toLocation: { type: String, required: true, trim: true, maxlength: 160, index: true },
    mode: { type: String, required: true, trim: true, maxlength: 80, index: true },
    durationHours: { type: Number, min: 0 },
    costMin: { type: Number, min: 0 },
    costMax: { type: Number, min: 0 },
    frequency: { type: String, trim: true, maxlength: 180 },
    notes: { type: String, trim: true, maxlength: 2000 },
    isActive: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0, index: true },
  },
  { timestamps: true },
);

TransportRouteMongoSchema.index({ sortOrder: 1, createdAt: -1 });
TransportRouteMongoSchema.index({
  fromLocation: "text",
  toLocation: "text",
  mode: "text",
  frequency: "text",
  notes: "text",
});

export const TransportRouteModel = mongoose.model<ITransportRoute>(
  "TransportRoute",
  TransportRouteMongoSchema,
);
