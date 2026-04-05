import { Types } from "mongoose";

export interface IHotel {
  _id?: Types.ObjectId;
  name: string;
  brand?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  timezone: string;
  currency: string;
  taxRate: number;
  website?: string;
  checkInTime: string;    // e.g., "14:00"
  checkOutTime: string;   // e.g., "11:00"
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export type HotelDocument = IHotel & Document;