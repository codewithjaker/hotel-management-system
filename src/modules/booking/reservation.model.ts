// models/reservation.model.ts
import { Schema, model, Types } from "mongoose";

const reservationRoomSchema = new Schema({
  roomId: { type: Types.ObjectId, ref: "Room" },
  pricePerNight: Number,
  adults: Number,
  children: Number,
});

const reservationSchema = new Schema(
  {
    hotelId: { type: Types.ObjectId, ref: "Hotel", index: true },
    guestId: { type: Types.ObjectId, ref: "Guest" },
    reservationNumber: { type: String, unique: true },

    source: String, // OTA / Website
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "no-show"],
      default: "pending",
    },

    checkInDate: Date,
    checkOutDate: Date,

    rooms: [reservationRoomSchema],

    totalAmount: Number,
    currency: { type: String, default: "BDT" },
  },
  { timestamps: true }
);

reservationSchema.index({ hotelId: 1, checkInDate: 1, checkOutDate: 1 });

export const Reservation = model("Reservation", reservationSchema);