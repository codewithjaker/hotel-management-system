import { Schema, model, Types } from "mongoose";
import { IHousekeeping, HousekeepingDocument } from "./housekeeping.interface";

const housekeepingSchema = new Schema<HousekeepingDocument>(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: "Hotel", required: true, index: true },
    roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true, index: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", index: true },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "inspected"],
      default: "pending",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    notes: String,
    scheduledAt: Date,
    startedAt: Date,
    completedAt: Date,
    inspectedAt: Date,
    inspectedBy: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

housekeepingSchema.index({ hotelId: 1, status: 1, priority: 1 });
export const Housekeeping = model<HousekeepingDocument>("Housekeeping", housekeepingSchema);