// models/payment.model.ts
import { Schema, model, Types } from "mongoose";

const paymentSchema = new Schema(
  {
    invoiceId: { type: Types.ObjectId, ref: "Invoice" },
    amount: Number,
    method: String,
    transactionRef: String,
    status: String,
    paidAt: Date,
  },
  { timestamps: true }
);

export const Payment = model("Payment", paymentSchema);