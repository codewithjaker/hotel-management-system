// src/modules/common/auditLog.model.ts

import { Schema, model, Types } from "mongoose";

export interface IAuditLog {
  userId?: Types.ObjectId;
  action: string;
  entityType: string;
  entityId?: Types.ObjectId;
  oldValue?: any;
  newValue?: any;
  ip?: string;
  userAgent?: string;
  createdAt?: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    userId: { type: Types.ObjectId, ref: "User" },

    action: {
      type: String,
      required: true,
      index: true,
    },

    entityType: {
      type: String, // "Reservation", "Invoice", etc.
      required: true,
      index: true,
    },

    entityId: {
      type: Types.ObjectId,
    },

    oldValue: {
      type: Schema.Types.Mixed,
    },

    newValue: {
      type: Schema.Types.Mixed,
    },

    ip: String,
    userAgent: String,
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// 🔥 Indexes for performance
auditLogSchema.index({ entityType: 1, entityId: 1 });
auditLogSchema.index({ userId: 1, createdAt: -1 });

export const AuditLog = model<IAuditLog>("AuditLog", auditLogSchema);