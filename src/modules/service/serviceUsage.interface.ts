import { Types } from "mongoose";

export interface IServiceUsage {
  _id?: Types.ObjectId;
  hotelId: Types.ObjectId;
  stayId: Types.ObjectId;
  serviceId: Types.ObjectId;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  usedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ServiceUsageDocument = IServiceUsage & Document;