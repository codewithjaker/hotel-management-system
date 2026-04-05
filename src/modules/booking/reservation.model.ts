import { Schema, model, Types } from "mongoose";
import { IReservation, IReservationRoom, ReservationDocument } from "./reservation.interface";

const reservationRoomSchema = new Schema<IReservationRoom>({
  roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
  pricePerNight: { type: Number, required: true, min: 0 },
  adults: { type: Number, required: true, min: 1 },
  children: { type: Number, default: 0, min: 0 },
});

const reservationSchema = new Schema<ReservationDocument>(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: "Hotel", required: true, index: true },
    guestId: { type: Schema.Types.ObjectId, ref: "Guest", required: true, index: true },
    reservationNumber: { type: String, unique: true, required: true },
    source: {
      type: String,
      enum: ["website", "ota", "walkin", "phone"],
      default: "website",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "no-show", "checked-in", "checked-out"],
      default: "pending",
      index: true,
    },
    checkInDate: { type: Date, required: true, index: true },
    checkOutDate: { type: Date, required: true, index: true },
    rooms: { type: [reservationRoomSchema], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    paidAmount: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: "USD", required: true },
    specialRequests: String,
    cancelledAt: Date,
    cancellationReason: String,
  },
  { timestamps: true }
);

// Composite index for overlap queries
reservationSchema.index({ hotelId: 1, "rooms.roomId": 1, checkInDate: 1, checkOutDate: 1 });

export const Reservation = model<ReservationDocument>("Reservation", reservationSchema);