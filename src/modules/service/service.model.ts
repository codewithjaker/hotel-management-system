import { Schema, model, Types } from "mongoose";
import { IService, ServiceDocument } from "./service.interface";

const serviceSchema = new Schema<ServiceDocument>(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: "Hotel", required: true, index: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["spa", "food", "laundry", "transport", "other"],
      default: "other",
      index: true,
    },
    price: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

serviceSchema.index({ hotelId: 1, name: 1 }, { unique: true });
export const Service = model<ServiceDocument>("Service", serviceSchema);