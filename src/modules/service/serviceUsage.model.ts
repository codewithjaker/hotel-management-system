// src/modules/service/serviceUsage.model.ts

import { Schema, model, Types } from "mongoose";

export interface IServiceUsage {
  hotelId: Types.ObjectId;
  stayId: Types.ObjectId;
  serviceId: Types.ObjectId;

  quantity: number;
  unitPrice: number;
  totalPrice: number;

  usedAt?: Date;
  createdAt?: Date;
}

const serviceUsageSchema = new Schema<IServiceUsage>(
  {
    hotelId: {
      type: Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
    },

    stayId: {
      type: Types.ObjectId,
      ref: "Stay",
      required: true,
      index: true,
    },

    serviceId: {
      type: Types.ObjectId,
      ref: "Service",
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },

    unitPrice: {
      type: Number,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    usedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

// 🔥 Auto calculate total price
serviceUsageSchema.pre("save", function (next) {
  this.totalPrice = this.quantity * this.unitPrice;
  next();
});

export const ServiceUsage = model<IServiceUsage>(
  "ServiceUsage",
  serviceUsageSchema
);