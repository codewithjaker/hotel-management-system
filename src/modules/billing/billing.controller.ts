// @ts-nocheck
import { Request, Response } from "express";
import { BillingService } from "./billing.service";
import { catchAsync } from "../../utils/catchAsync";
import { ApiResponse, ApiError } from "../../utils/apiResponse";
import { Types } from "mongoose";

export class BillingController {
  // Invoice endpoints
  static generateInvoiceForReservation = catchAsync(async (req: Request, res: Response) => {
    const invoice = await BillingService.generateInvoiceForReservation(new Types.ObjectId(req.params.reservationId));
    res.status(201).json(new ApiResponse(201, invoice, "Invoice generated"));
  });

  static getAllInvoices = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filter: any = {};
    if (req.query.reservationId) filter.reservationId = req.query.reservationId;
    if (req.query.status) filter.status = req.query.status;
    const result = await BillingService.getAllInvoices(filter, page, limit);
    res.status(200).json(new ApiResponse(200, result));
  });

  static getInvoiceById = catchAsync(async (req: Request, res: Response) => {
    const invoice = await BillingService.getInvoiceWithPayments(req.params.id);
    if (!invoice) throw new ApiError(404, "Invoice not found");
    res.status(200).json(new ApiResponse(200, invoice));
  });

  static updateInvoice = catchAsync(async (req: Request, res: Response) => {
    const updated = await BillingService.updateInvoice(req.params.id, req.body);
    if (!updated) throw new ApiError(404, "Invoice not found");
    res.status(200).json(new ApiResponse(200, updated, "Invoice updated"));
  });

  static cancelInvoice = catchAsync(async (req: Request, res: Response) => {
    const cancelled = await BillingService.cancelInvoice(req.params.id);
    if (!cancelled) throw new ApiError(404, "Invoice not found");
    res.status(200).json(new ApiResponse(200, cancelled, "Invoice cancelled"));
  });

  static deleteInvoice = catchAsync(async (req: Request, res: Response) => {
    await BillingService.deleteInvoice(req.params.id);
    res.status(204).json(new ApiResponse(204, null, "Invoice deleted"));
  });

  // Payment endpoints
  static addPayment = catchAsync(async (req: Request, res: Response) => {
    const { payment, invoice } = await BillingService.addPayment(req.body);
    res.status(201).json(new ApiResponse(201, { payment, invoice }, "Payment recorded"));
  });

  static getAllPayments = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filter: any = {};
    if (req.query.invoiceId) filter.invoiceId = req.query.invoiceId;
    if (req.query.status) filter.status = req.query.status;
    const result = await BillingService.getAllPayments(filter, page, limit);
    res.status(200).json(new ApiResponse(200, result));
  });

  static getPaymentById = catchAsync(async (req: Request, res: Response) => {
    const payment = await BillingService.getPaymentById(req.params.id);
    if (!payment) throw new ApiError(404, "Payment not found");
    res.status(200).json(new ApiResponse(200, payment));
  });

  static updatePayment = catchAsync(async (req: Request, res: Response) => {
    const updated = await BillingService.updatePayment(req.params.id, req.body);
    if (!updated) throw new ApiError(404, "Payment not found");
    res.status(200).json(new ApiResponse(200, updated, "Payment updated"));
  });

  static deletePayment = catchAsync(async (req: Request, res: Response) => {
    await BillingService.deletePayment(req.params.id);
    res.status(204).json(new ApiResponse(204, null, "Payment deleted"));
  });
}