import { Types } from "mongoose";

export interface IUser {
  _id?: Types.ObjectId;
  hotelId?: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: "admin" | "manager" | "receptionist";
  status: "active" | "inactive" | "suspended";
  lastLoginAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserDocument = IUser & IUserMethods & Document;