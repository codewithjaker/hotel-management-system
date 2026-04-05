import { Schema, model, Types } from "mongoose";
import { IServiceUsage, ServiceUsageDocument } from "./serviceUsage.interface";

const serviceUsageSchema = new Schema<ServiceUsageDocument>(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: "Hotel", required: true, index: true },
    stayId: { type: Schema.Types.ObjectId, ref: "Stay", required: true, index: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    quantity: { type: Number, default: 1, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    usedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

serviceUsageSchema.pre("save", function (next) {
  this.totalPrice = this.quantity * this.unitPrice;
  next();
});

export const ServiceUsage = model<ServiceUsageDocument>("ServiceUsage", serviceUsageSchema);