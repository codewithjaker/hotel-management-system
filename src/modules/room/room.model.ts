// models/room.model.ts
import { Schema, model, Types } from "mongoose";

const roomSchema = new Schema(
  {
    hotelId: { type: Types.ObjectId, ref: "Hotel", index: true },
    roomTypeId: { type: Types.ObjectId, ref: "RoomType" },
    roomNumber: { type: String, required: true },
    floor: Number,
    status: {
      type: String,
      enum: ["available", "occupied", "maintenance"],
      default: "available",
    },
    housekeepingStatus: {
      type: String,
      enum: ["clean", "dirty", "inspected"],
      default: "clean",
    },
  },
  { timestamps: true }
);

roomSchema.index({ hotelId: 1, roomNumber: 1 }, { unique: true });

export const Room = model("Room", roomSchema);