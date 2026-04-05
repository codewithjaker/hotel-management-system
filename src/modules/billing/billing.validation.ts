import { z } from "zod";

const objectId = z.string().length(24, "Invalid ID format");

export const generateInvoiceSchema = z.object({
  params: z.object({
    reservationId: objectId,
  }),
});

export const invoiceQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    reservationId: objectId.optional(),
    status: z.enum(["draft", "issued", "paid", "partial", "cancelled"]).optional(),
  }),
});

export const updateInvoiceSchema = z.object({
  body: z.object({
    dueDate: z.string().datetime().optional(),
    notes: z.string().optional(),
    status: z.enum(["draft", "issued", "paid", "partial", "cancelled"]).optional(),
  }),
});

export const invoiceIdParamSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

export const createPaymentSchema = z.object({
  body: z.object({
    invoiceId: objectId,
    amount: z.number().min(0.01),
    method: z.enum(["cash", "card", "bank_transfer", "online", "other"]),
    transactionRef: z.string().optional(),
    paidAt: z.string().datetime().optional(),
    notes: z.string().optional(),
  }),
});

export const updatePaymentSchema = z.object({
  body: z.object({
    amount: z.number().min(0.01).optional(),
    method: z.enum(["cash", "card", "bank_transfer", "online", "other"]).optional(),
    transactionRef: z.string().optional(),
    status: z.enum(["pending", "completed", "failed", "refunded"]).optional(),
    paidAt: z.string().datetime().optional(),
    notes: z.string().optional(),
  }),
});

export const paymentIdParamSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

export const paymentQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    invoiceId: objectId.optional(),
    status: z.enum(["pending", "completed", "failed", "refunded"]).optional(),
  }),
});