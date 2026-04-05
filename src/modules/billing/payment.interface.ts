import { Types } from "mongoose";

export interface IPayment {
  _id?: Types.ObjectId;
  invoiceId: Types.ObjectId;
  amount: number;
  method: "cash" | "card" | "bank_transfer" | "online" | "other";
  transactionRef?: string;
  status: "pending" | "completed" | "failed" | "refunded";
  paidAt: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PaymentDocument = IPayment & Document;