import { Types } from "mongoose";

export interface IMaintenance {
  _id?: Types.ObjectId;
  hotelId: Types.ObjectId;
  roomId?: Types.ObjectId;
  issueType: "electrical" | "plumbing" | "furniture" | "ac" | "other";
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  status: "reported" | "in_progress" | "resolved" | "closed";
  reportedBy?: Types.ObjectId;
  assignedTo?: Types.ObjectId;
  cost?: number;
  reportedAt: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type MaintenanceDocument = IMaintenance & Document;