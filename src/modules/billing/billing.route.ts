import { Router } from "express";
import { BillingController } from "./billing.controller";
import { validate } from "../../middlewares/validate.middleware";
import {
  generateInvoiceSchema,
  invoiceQuerySchema,
  updateInvoiceSchema,
  invoiceIdParamSchema,
  createPaymentSchema,
  updatePaymentSchema,
  paymentIdParamSchema,
  paymentQuerySchema,
} from "./billing.validation";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = Router();
router.use(authMiddleware);

// Invoice routes
router.post(
  "/invoices/generate/:reservationId",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(generateInvoiceSchema, "params"),
  BillingController.generateInvoiceForReservation
);

router.get(
  "/invoices",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(invoiceQuerySchema, "query"),
  BillingController.getAllInvoices
);

router.get(
  "/invoices/:id",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(invoiceIdParamSchema, "params"),
  BillingController.getInvoiceById
);

router.patch(
  "/invoices/:id",
  roleMiddleware(["admin", "manager"]),
  validate(invoiceIdParamSchema, "params"),
  validate(updateInvoiceSchema),
  BillingController.updateInvoice
);

router.post(
  "/invoices/:id/cancel",
  roleMiddleware(["admin", "manager"]),
  validate(invoiceIdParamSchema, "params"),
  BillingController.cancelInvoice
);

router.delete(
  "/invoices/:id",
  roleMiddleware(["admin"]),
  validate(invoiceIdParamSchema, "params"),
  BillingController.deleteInvoice
);

// Payment routes
router.post(
  "/payments",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(createPaymentSchema),
  BillingController.addPayment
);

router.get(
  "/payments",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(paymentQuerySchema, "query"),
  BillingController.getAllPayments
);

router.get(
  "/payments/:id",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(paymentIdParamSchema, "params"),
  BillingController.getPaymentById
);

router.patch(
  "/payments/:id",
  roleMiddleware(["admin", "manager"]),
  validate(paymentIdParamSchema, "params"),
  validate(updatePaymentSchema),
  BillingController.updatePayment
);

router.delete(
  "/payments/:id",
  roleMiddleware(["admin"]),
  validate(paymentIdParamSchema, "params"),
  BillingController.deletePayment
);

export default router;