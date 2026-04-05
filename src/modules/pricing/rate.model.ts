import { Schema, model, Types } from "mongoose";
import { IRoomRate, RoomRateDocument } from "./pricing.interface";

const rateSchema = new Schema<RoomRateDocument>(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: "Hotel", required: true, index: true },
    roomTypeId: { type: Schema.Types.ObjectId, ref: "RoomType", required: true, index: true },
    date: { type: Date, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    inventory: { type: Number, min: 0, default: null },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

// Unique constraint: one rate per room type per date
rateSchema.index({ roomTypeId: 1, date: 1 }, { unique: true });

export const RoomRate = model<RoomRateDocument>("RoomRate", rateSchema);