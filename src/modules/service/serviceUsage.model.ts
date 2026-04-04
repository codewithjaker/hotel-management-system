// models/serviceUsage.model.ts
import { Schema, model, Types } from "mongoose";

const serviceUsageSchema = new Schema(
  {
    stayId: { type: Types.ObjectId, ref: "Stay" },
    serviceId: { type: Types.ObjectId, ref: "Service" },
    quantity: Number,
    totalPrice: Number,
  },
  { timestamps: true }
);

export const ServiceUsage = model("ServiceUsage", serviceUsageSchema);