import { Schema, model } from "mongoose";
import { IHotel, HotelDocument } from "./hotel.interface";

const hotelSchema = new Schema<HotelDocument>(
  {
    name: { type: String, required: true, trim: true, index: true },
    brand: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true, index: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true, index: true },
    postalCode: { type: String, trim: true },
    timezone: { type: String, default: "UTC", required: true },
    currency: { type: String, default: "USD", required: true },
    taxRate: { type: Number, default: 0, min: 0, max: 100 },
    website: { type: String, trim: true },
    checkInTime: { type: String, default: "14:00" },
    checkOutTime: { type: String, default: "11:00" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

// Ensure unique hotel name (soft delete plugin would handle duplicates)
hotelSchema.index({ name: 1 }, { unique: true });

export const Hotel = model<HotelDocument>("Hotel", hotelSchema);