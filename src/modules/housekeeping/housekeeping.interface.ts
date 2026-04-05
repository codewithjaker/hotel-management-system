import { Types } from "mongoose";

export interface IHousekeeping {
  _id?: Types.ObjectId;
  hotelId: Types.ObjectId;
  roomId: Types.ObjectId;
  assignedTo?: Types.ObjectId;        // User (staff)
  status: "pending" | "in_progress" | "completed" | "inspected";
  priority: "low" | "medium" | "high";
  notes?: string;
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  inspectedAt?: Date;
  inspectedBy?: Types.ObjectId;       // User (supervisor)
  createdAt?: Date;
  updatedAt?: Date;
}

export type HousekeepingDocument = IHousekeeping & Document;