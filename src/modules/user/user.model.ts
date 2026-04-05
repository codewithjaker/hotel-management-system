import { Schema, model, Types, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser, IUserMethods, UserDocument } from "./user.interface";

const userSchema = new Schema<UserDocument>(
  {
    hotelId: { type: Types.ObjectId, ref: "Hotel", index: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "manager", "receptionist"],
      default: "receptionist",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Remove passwordHash when converting to JSON
// userSchema.set("toJSON", {
//   transform: (_doc, ret) => {
//     delete ret.passwordHash;
//     return ret;
//   },
// });

export const User = model<UserDocument>("User", userSchema);