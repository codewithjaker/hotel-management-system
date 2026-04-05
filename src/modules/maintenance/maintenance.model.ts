// src/modules/maintenance/maintenance.model.ts

import { Schema, model, Types } from "mongoose";

export interface IMaintenance {
  hotelId: Types.ObjectId;
  roomId?: Types.ObjectId;

  issueType: "electrical" | "plumbing" | "furniture" | "ac" | "other";

  description: string;

  priority: "low" | "medium" | "high" | "critical";

  status: "reported" | "in_progress" | "resolved" | "closed";

  reportedBy?: Types.ObjectId;
  assignedTo?: Types.ObjectId;

  cost?: number;

  reportedAt?: Date;
  resolvedAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

const maintenanceSchema = new Schema<IMaintenance>(
  {
    hotelId: {
      type: Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
    },

    roomId: {
      type: Types.ObjectId,
      ref: "Room",
      index: true,
    },

    issueType: {
      type: String,
      enum: ["electrical", "plumbing", "furniture", "ac", "other"],
      required: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
    },

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

    reportedBy: {
      type: Types.ObjectId,
      ref: "User",
    },

    assignedTo: {
      type: Types.ObjectId,
      ref: "User",
    },

    cost: {
      type: Number,
      min: 0,
    },

    reportedAt: {
      type: Date,
      default: Date.now,
    },

    resolvedAt: Date,
  },
  { timestamps: true }
);

// 🔥 Operational index
maintenanceSchema.index({ hotelId: 1, status: 1, priority: 1 });

export const Maintenance = model<IMaintenance>(
  "Maintenance",
  maintenanceSchema
);