// models/user.model.ts
import { Schema, model, Types } from "mongoose";

const userSchema = new Schema(
  {
    hotelId: { type: Types.ObjectId, ref: "Hotel" },
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    passwordHash: String,
    role: {
      type: String,
      enum: ["admin", "manager", "receptionist"],
    },
    status: { type: String, default: "active" },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

export const User = model("User", userSchema);