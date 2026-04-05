// src/modules/housekeeping/housekeeping.model.ts

import { Schema, model, Types } from "mongoose";

export interface IHousekeeping {
  hotelId: Types.ObjectId;
  roomId: Types.ObjectId;

  assignedTo?: Types.ObjectId;

  status: "pending" | "in_progress" | "completed" | "inspected";

  priority: "low" | "medium" | "high";

  notes?: string;

  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

const housekeepingSchema = new Schema<IHousekeeping>(
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
      required: true,
      index: true,
    },

    assignedTo: {
      type: Types.ObjectId,
      ref: "User",
      index: true,
    },

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
  },
  { timestamps: true }
);

// 🔥 Index for operational dashboards
housekeepingSchema.index({ hotelId: 1, status: 1 });

export const Housekeeping = model<IHousekeeping>(
  "Housekeeping",
  housekeepingSchema
);