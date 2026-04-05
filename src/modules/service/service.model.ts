// src/modules/service/service.model.ts

import { Schema, model, Types } from "mongoose";

export interface IService {
  hotelId: Types.ObjectId;
  name: string;
  category: "spa" | "food" | "laundry" | "transport" | "other";
  price: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const serviceSchema = new Schema<IService>(
  {
    hotelId: {
      type: Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: ["spa", "food", "laundry", "transport", "other"],
      default: "other",
      index: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Unique service name per hotel
serviceSchema.index({ hotelId: 1, name: 1 }, { unique: true });

export const Service = model<IService>("Service", serviceSchema);