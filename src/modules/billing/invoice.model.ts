// models/invoice.model.ts
import { Schema, model, Types } from "mongoose";

const invoiceItemSchema = new Schema({
  description: String,
  quantity: Number,
  unitPrice: Number,
  totalPrice: Number,
});

const invoiceSchema = new Schema(
  {
    reservationId: { type: Types.ObjectId, ref: "Reservation" },
    invoiceNumber: { type: String, unique: true },

    items: [invoiceItemSchema],

    totalAmount: Number,
    taxAmount: Number,
    discountAmount: Number,

    status: {
      type: String,
      enum: ["draft", "paid", "partial"],
      default: "draft",
    },
  },
  { timestamps: true }
);

export const Invoice = model("Invoice", invoiceSchema);