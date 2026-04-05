import { Types } from "mongoose";

export interface IService {
  _id?: Types.ObjectId;
  hotelId: Types.ObjectId;
  name: string;
  category: "spa" | "food" | "laundry" | "transport" | "other";
  price: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ServiceDocument = IService & Document;