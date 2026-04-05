// src/modules/guest/guest.model.ts

import { Schema, model, Types } from "mongoose";
import { IGuest, GuestDocument } from "./guest.interface";

const guestSchema = new Schema<GuestDocument>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true, index: true, sparse: true },
    phone: { type: String, trim: true, index: true, sparse: true },
    nationality: { type: String, trim: true },
    idType: {
      type: String,
      enum: ["passport", "nid", "driving_license", "other"],
    },
    idNumber: { type: String, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    country: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    preferences: {
      language: { type: String, default: "en" },
      smoking: { type: Boolean, default: false },
      specialRequests: String,
    },
    notes: { type: String },
  },
  { timestamps: true }
);

// Compound index for duplicate detection (email + phone combination not required, but unique on email if present)
guestSchema.index({ email: 1 }, { unique: true, partialFilterExpression: { email: { $exists: true, $ne: null } } });
guestSchema.index({ phone: 1 }, { unique: true, partialFilterExpression: { phone: { $exists: true, $ne: null } } });

// Virtual for full name
guestSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName || ""}`.trim();
});

// Ensure virtuals are included in JSON output
guestSchema.set("toJSON", { virtuals: true });
guestSchema.set("toObject", { virtuals: true });

export const Guest = model<GuestDocument>("Guest", guestSchema);