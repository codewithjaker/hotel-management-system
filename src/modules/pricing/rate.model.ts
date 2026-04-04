// models/rate.model.ts
import { Schema, model, Types } from "mongoose";

const rateSchema = new Schema(
  {
    hotelId: { type: Types.ObjectId, ref: "Hotel" },
    roomTypeId: { type: Types.ObjectId, ref: "RoomType" },

    date: { type: Date, index: true },
    price: Number,
    inventory: Number,
  },
  { timestamps: true }
);

rateSchema.index(
  { roomTypeId: 1, date: 1 },
  { unique: true }
);

export const RoomRate = model("RoomRate", rateSchema);