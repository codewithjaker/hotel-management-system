import { Schema, model, Types } from "mongoose";
import { IStay, StayDocument } from "./stay.interface";

const staySchema = new Schema<StayDocument>(
  {
    reservationId: { type: Schema.Types.ObjectId, ref: "Reservation", required: true, index: true },
    guestId: { type: Schema.Types.ObjectId, ref: "Guest", required: true, index: true },
    roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true, index: true },
    checkInAt: { type: Date, required: true },
    checkOutAt: Date,
    status: { type: String, enum: ["active", "completed"], default: "active" },
  },
  { timestamps: true }
);

export const Stay = model<StayDocument>("Stay", staySchema);