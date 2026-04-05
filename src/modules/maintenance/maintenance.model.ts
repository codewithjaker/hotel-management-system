import { Schema, model, Types } from "mongoose";
import { IMaintenance, MaintenanceDocument } from "./maintenance.interface";

const maintenanceSchema = new Schema<MaintenanceDocument>(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: "Hotel", required: true, index: true },
    roomId: { type: Schema.Types.ObjectId, ref: "Room", index: true },
    issueType: {
      type: String,
      enum: ["electrical", "plumbing", "furniture", "ac", "other"],
      required: true,
      index: true,
    },
    description: { type: String, required: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
      index: true,
    },
    status: {
      type: String,
      enum: ["reported", "in_progress", "resolved", "closed"],
      default: "reported",
      index: true,
    },
    reportedBy: { type: Schema.Types.ObjectId, ref: "User", index: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", index: true },
    cost: { type: Number, min: 0 },
    reportedAt: { type: Date, default: Date.now },
    resolvedAt: Date,
    closedAt: Date,
    notes: String,
  },
  { timestamps: true }
);

maintenanceSchema.index({ hotelId: 1, status: 1, priority: 1 });
export const Maintenance = model<MaintenanceDocument>("Maintenance", maintenanceSchema);