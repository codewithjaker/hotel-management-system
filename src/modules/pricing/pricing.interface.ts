import { Types } from "mongoose";

export interface IRoomRate {
  _id?: Types.ObjectId;
  hotelId: Types.ObjectId;
  roomTypeId: Types.ObjectId;
  date: Date;
  price: number;
  inventory?: number;      // Available rooms for this rate (optional)
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type RoomRateDocument = IRoomRate & Document;