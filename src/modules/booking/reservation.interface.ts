import { Types } from "mongoose";

export interface IReservationRoom {
  roomId: Types.ObjectId;
  pricePerNight: number;
  adults: number;
  children: number;
}

export interface IReservation {
  _id?: Types.ObjectId;
  hotelId: Types.ObjectId;
  guestId: Types.ObjectId;
  reservationNumber: string;
  source: "website" | "ota" | "walkin" | "phone";
  status: "pending" | "confirmed" | "cancelled" | "no-show" | "checked-in" | "checked-out";
  checkInDate: Date;
  checkOutDate: Date;
  rooms: IReservationRoom[];
  totalAmount: number;
  paidAmount: number;
  currency: string;
  specialRequests?: string;
  cancelledAt?: Date;
  cancellationReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ReservationDocument = IReservation & Document;