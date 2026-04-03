import { Schema, model } from "mongoose";
import { IHotel } from "./hotel.interface";

const hotelSchema = new Schema<IHotel>(
  {
    name: { type: String, required: true },
    brand: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    country: String,
    timezone: String,
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

export const Hotel = model<IHotel>("Hotel", hotelSchema);
