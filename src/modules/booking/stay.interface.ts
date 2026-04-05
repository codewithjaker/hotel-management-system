import { Types } from "mongoose";

export interface IStay {
  _id?: Types.ObjectId;
  reservationId: Types.ObjectId;
  guestId: Types.ObjectId;
  roomId: Types.ObjectId;
  checkInAt: Date;
  checkOutAt?: Date;
  status: "active" | "completed";
  createdAt?: Date;
  updatedAt?: Date;
}

export type StayDocument = IStay & Document;