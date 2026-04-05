import { Types } from "mongoose";

export interface IRoomType {
  _id?: Types.ObjectId;
  hotelId: Types.ObjectId;
  name: string;
  description?: string;
  capacityAdults: number;
  capacityChildren: number;
  basePrice: number;
  bedType?: string;
  amenities?: string[];
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type RoomTypeDocument = IRoomType & Document;