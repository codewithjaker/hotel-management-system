import { Schema, model, Types } from "mongoose";
import { IRoomType, RoomTypeDocument } from "./roomType.interface";

const roomTypeSchema = new Schema<RoomTypeDocument>(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: "Hotel", required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    capacityAdults: { type: Number, required: true, min: 1, default: 2 },
    capacityChildren: { type: Number, default: 0, min: 0 },
    basePrice: { type: Number, required: true, min: 0 },
    bedType: { type: String, trim: true },
    amenities: [{ type: String }],
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

// Unique room type name per hotel
roomTypeSchema.index({ hotelId: 1, name: 1 }, { unique: true });

export const RoomType = model<RoomTypeDocument>("RoomType", roomTypeSchema);