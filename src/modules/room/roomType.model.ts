// models/roomType.model.ts
import { Schema, model, Types } from "mongoose";

const roomTypeSchema = new Schema(
  {
    hotelId: { type: Types.ObjectId, ref: "Hotel", index: true },
    name: String,
    description: String,
    capacityAdults: Number,
    capacityChildren: Number,
    basePrice: Number,
    bedType: String,
  },
  { timestamps: true }
);

export const RoomType = model("RoomType", roomTypeSchema);