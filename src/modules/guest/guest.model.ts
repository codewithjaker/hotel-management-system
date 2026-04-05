// src/modules/guest/guest.model.ts

import { Schema, model } from "mongoose";

const guestSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: String,
    email: { type: String, index: true },
    phone: String,
    nationality: String,
    idType: String,     // Passport / NID
    idNumber: String,
  },
  { timestamps: true }
);

export const Guest = model("Guest", guestSchema);