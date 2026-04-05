import { Types } from "mongoose";

export interface IRoom {
  _id?: Types.ObjectId;
  hotelId: Types.ObjectId;
  roomTypeId: Types.ObjectId;
  roomNumber: string;
  floor?: number;
  status: "available" | "occupied" | "maintenance" | "cleaning";
  housekeepingStatus: "clean" | "dirty" | "inspected";
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type RoomDocument = IRoom & Document;