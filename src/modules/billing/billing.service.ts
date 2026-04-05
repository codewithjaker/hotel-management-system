import { Types, startSession } from "mongoose";
import { Invoice } from "./invoice.model";
import { Payment } from "./payment.model";
import { IInvoice, IInvoiceItem } from "./invoice.interface";
import { IPayment } from "./payment.interface";
import { ApiError } from "../../utils/apiResponse";
import { generateInvoiceNumber } from "./billing.utils";

export class BillingService {
  // Generate invoice from a reservation (called on check-out)
  static async generateInvoiceForReservation(reservationId: Types.ObjectId): Promise<IInvoice> {
    const session = await startSession();
    session.startTransaction();
    try {
      // Check if invoice already exists
      const existing = await Invoice.findOne({ reservationId }).session(session);
      if (existing) throw new ApiError(409, "Invoice already exists for this reservation");

      const { Reservation } = await import("../booking/reservation.model");
      const { ServiceUsage } = await import("../service/serviceUsage.model");

      const reservation = await Reservation.findById(reservationId)
        .populate("rooms.roomId")
        .session(session);
      if (!reservation) throw new ApiError(404, "Reservation not found");

      // Build invoice items
      const items: IInvoiceItem[] = [];

      // 1. Room charges
      for (const room of reservation.rooms) {
        const nights = this.calculateNights(reservation.checkInDate, reservation.checkOutDate);
        items.push({
          description: `Room ${(room.roomId as any).roomNumber} - ${nights} night(s)`,
          quantity: nights,
          unitPrice: room.pricePerNight,
          totalPrice: nights * room.pricePerNight,
        });
      }

      // 2. Service usages (if any)
      const serviceUsages = await ServiceUsage.find({
        stayId: { $in: await this.getStayIdsByReservation(reservationId, session) },
      }).session(session);
      for (const usage of serviceUsages) {
        items.push({
          description: `Service: ${usage.serviceId}`,
          quantity: usage.quantity,
          unitPrice: usage.unitPrice,
          totalPrice: usage.totalPrice,
        });
      }

      const subtotal = items.reduce((sum, i) => sum + i.totalPrice, 0);
      const taxRate = 0.1; // 10% tax – should come from hotel settings
      const taxAmount = subtotal * taxRate;
      const discountAmount = 0; // could be fetched from reservation discounts
      const totalAmount = subtotal + taxAmount - discountAmount;

      const invoiceNumber = generateInvoiceNumber();
      const invoice = await Invoice.create([{
        reservationId,
        invoiceNumber,
        items,
        subtotal,
        taxAmount,
        discountAmount,
        totalAmount,
        paidAmount: 0,
        status: "issued",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      }], { session });

      await session.commitTransaction();
      return invoice[0].toJSON();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Add a payment to an invoice and update paid amount & status
  static async addPayment(paymentData: Partial<IPayment>): Promise<{ payment: IPayment; invoice: IInvoice }> {
    const session = await startSession();
    session.startTransaction();
    try {
      const invoice = await Invoice.findById(paymentData.invoiceId).session(session);
      if (!invoice) throw new ApiError(404, "Invoice not found");
      if (invoice.status === "cancelled") throw new ApiError(400, "Cannot pay a cancelled invoice");
      if (invoice.status === "paid") throw new ApiError(400, "Invoice already fully paid");

      const payment = await Payment.create([{
        invoiceId: paymentData.invoiceId,
        amount: paymentData.amount,
        method: paymentData.method,
        transactionRef: paymentData.transactionRef,
        status: "completed",
        paidAt: paymentData.paidAt || new Date(),
        notes: paymentData.notes,
      }], { session });

      // Update invoice paid amount and status
      const newPaidAmount = invoice.paidAmount + paymentData.amount!;
      let newStatus: IInvoice["status"] = "partial";
      if (newPaidAmount >= invoice.totalAmount) {
        newStatus = "paid";
      } else if (newPaidAmount > 0) {
        newStatus = "partial";
      }

      const updatedInvoice = await Invoice.findByIdAndUpdate(
        invoice._id,
        { paidAmount: newPaidAmount, status: newStatus },
        { new: true, session }
      );

      await session.commitTransaction();
      return { payment: payment[0].toJSON(), invoice: updatedInvoice!.toJSON() };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Get invoice by ID with payments
  static async getInvoiceWithPayments(invoiceId: string | Types.ObjectId): Promise<any> {
    const invoice = await Invoice.findById(invoiceId).lean();
    if (!invoice) return null;
    const payments = await Payment.find({ invoiceId }).sort({ paidAt: -1 }).lean();
    return { ...invoice, payments };
  }

  // CRUD for invoices
  static async getAllInvoices(
    filter: Record<string, any> = {},
    page = 1,
    limit = 10
  ): Promise<{ invoices: IInvoice[]; total: number }> {
    const skip = (page - 1) * limit;
    const [invoices, total] = await Promise.all([
      Invoice.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      Invoice.countDocuments(filter),
    ]);
    return { invoices, total };
  }

  static async getInvoiceById(id: string | Types.ObjectId): Promise<IInvoice | null> {
    return Invoice.findById(id).lean();
  }

  static async updateInvoice(
    id: string | Types.ObjectId,
    updateData: Partial<IInvoice>
  ): Promise<IInvoice | null> {
    // Prevent updating critical fields
    const disallowed = ["invoiceNumber", "reservationId", "totalAmount", "paidAmount"];
    disallowed.forEach(field => delete (updateData as any)[field]);
    const invoice = await Invoice.findByIdAndUpdate(id, updateData, { new: true }).lean();
    return invoice;
  }

  static async cancelInvoice(id: string | Types.ObjectId): Promise<IInvoice | null> {
    const invoice = await Invoice.findByIdAndUpdate(
      id,
      { status: "cancelled" },
      { new: true }
    ).lean();
    return invoice;
  }

  static async deleteInvoice(id: string | Types.ObjectId): Promise<boolean> {
    const invoice = await Invoice.findById(id);
    if (!invoice) return false;
    if (invoice.status === "paid") throw new ApiError(400, "Cannot delete a paid invoice");
    // Delete associated payments
    await Payment.deleteMany({ invoiceId: id });
    const result = await Invoice.findByIdAndDelete(id);
    return !!result;
  }

  // Payment CRUD
  static async getAllPayments(
    filter: Record<string, any> = {},
    page = 1,
    limit = 10
  ): Promise<{ payments: IPayment[]; total: number }> {
    const skip = (page - 1) * limit;
    const [payments, total] = await Promise.all([
      Payment.find(filter).skip(skip).limit(limit).sort({ paidAt: -1 }).lean(),
      Payment.countDocuments(filter),
    ]);
    return { payments, total };
  }

  static async getPaymentById(id: string | Types.ObjectId): Promise<IPayment | null> {
    return Payment.findById(id).lean();
  }

  static async updatePayment(
    id: string | Types.ObjectId,
    updateData: Partial<IPayment>
  ): Promise<IPayment | null> {
    const payment = await Payment.findByIdAndUpdate(id, updateData, { new: true }).lean();
    return payment;
  }

  static async deletePayment(id: string | Types.ObjectId): Promise<boolean> {
    const result = await Payment.findByIdAndDelete(id);
    return !!result;
  }

  // Helper: get stay IDs for a reservation
  private static async getStayIdsByReservation(reservationId: Types.ObjectId, session: any): Promise<Types.ObjectId[]> {
    const { Stay } = await import("../booking/stay.model");
    const stays = await Stay.find({ reservationId }).session(session).select("_id");
    return stays.map(s => s._id);
  }

  private static calculateNights(checkIn: Date, checkOut: Date): number {
    const diff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}