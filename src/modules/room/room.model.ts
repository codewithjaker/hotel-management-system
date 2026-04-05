import { Schema, model, Types } from "mongoose";
import { IRoom, RoomDocument } from "./room.interface";

const roomSchema = new Schema<RoomDocument>(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: "Hotel", required: true, index: true },
    roomTypeId: { type: Schema.Types.ObjectId, ref: "RoomType", required: true, index: true },
    roomNumber: { type: String, required: true, trim: true },
    floor: { type: Number },
    status: {
      type: String,
      enum: ["available", "occupied", "maintenance", "cleaning"],
      default: "available",
      index: true,
    },
    housekeepingStatus: {
      type: String,
      enum: ["clean", "dirty", "inspected"],
      default: "clean",
    },
    notes: { type: String },
  },
  { timestamps: true }
);

roomSchema.index({ hotelId: 1, roomNumber: 1 }, { unique: true });

export const Room = model<RoomDocument>("Room", roomSchema);