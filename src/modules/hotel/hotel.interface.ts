import { Types } from "mongoose";

export interface IHotel {
  _id?: Types.ObjectId;
  name: string;
  brand?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  timezone?: string;
  status?: "active" | "inactive";
}
