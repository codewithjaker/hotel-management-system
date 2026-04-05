import { Schema, model, Types } from "mongoose";
import { IPayment, PaymentDocument } from "./payment.interface";

const paymentSchema = new Schema<PaymentDocument>(
  {
    invoiceId: { type: Schema.Types.ObjectId, ref: "Invoice", required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    method: {
      type: String,
      enum: ["cash", "card", "bank_transfer", "online", "other"],
      required: true,
    },
    transactionRef: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paidAt: { type: Date, default: Date.now },
    notes: String,
  },
  { timestamps: true }
);

export const Payment = model<PaymentDocument>("Payment", paymentSchema);