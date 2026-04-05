import { Types } from "mongoose";

export interface IInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface IInvoice {
  _id?: Types.ObjectId;
  reservationId: Types.ObjectId;
  invoiceNumber: string;
  items: IInvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  status: "draft" | "issued" | "paid" | "partial" | "cancelled";
  dueDate?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type InvoiceDocument = IInvoice & Document;