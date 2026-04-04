// models/stay.model.ts
import { Schema, model, Types } from "mongoose";

const staySchema = new Schema(
  {
    reservationId: { type: Types.ObjectId, ref: "Reservation" },
    guestId: { type: Types.ObjectId, ref: "Guest" },
    roomId: { type: Types.ObjectId, ref: "Room" },

    checkInAt: Date,
    checkOutAt: Date,

    status: {
      type: String,
      enum: ["active", "completed"],
    },
  },
  { timestamps: true }
);

export const Stay = model("Stay", staySchema);