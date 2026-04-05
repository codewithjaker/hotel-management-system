import { Schema, model, Types } from "mongoose";
import { IInvoice, IInvoiceItem, InvoiceDocument } from "./invoice.interface";

const invoiceItemSchema = new Schema<IInvoiceItem>({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  totalPrice: { type: Number, required: true, min: 0 },
});

const invoiceSchema = new Schema<InvoiceDocument>(
  {
    reservationId: { type: Schema.Types.ObjectId, ref: "Reservation", required: true, index: true },
    invoiceNumber: { type: String, unique: true, required: true },
    items: [invoiceItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    taxAmount: { type: Number, default: 0, min: 0 },
    discountAmount: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    paidAmount: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["draft", "issued", "paid", "partial", "cancelled"],
      default: "draft",
      index: true,
    },
    dueDate: Date,
    notes: String,
  },
  { timestamps: true }
);

invoiceSchema.index({ reservationId: 1 }, { unique: true });
export const Invoice = model<InvoiceDocument>("Invoice", invoiceSchema);