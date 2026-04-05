import { Router } from "express";
import { PricingController } from "./pricing.controller";
import { validate } from "../../middlewares/validate.middleware";
import {
  createRateSchema,
  bulkCreateRatesSchema,
  updateRateSchema,
  rateIdParamSchema,
  rateQuerySchema,
} from "./pricing.validation";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = Router();
router.use(authMiddleware);

// GET /api/rates - list rates (all authenticated)
router.get(
  "/",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(rateQuerySchema, "query"),
  PricingController.getAllRates
);

// GET /api/rates/:id - get single rate
router.get(
  "/:id",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(rateIdParamSchema, "params"),
  PricingController.getRateById
);

// POST /api/rates - create single rate (admin/manager)
router.post(
  "/",
  roleMiddleware(["admin", "manager"]),
  validate(createRateSchema),
  PricingController.createRate
);

// POST /api/rates/bulk - bulk create rates for date range (admin/manager)
router.post(
  "/bulk",
  roleMiddleware(["admin", "manager"]),
  validate(bulkCreateRatesSchema),
  PricingController.bulkCreateRates
);

// PATCH /api/rates/:id - update rate (admin/manager)
router.patch(
  "/:id",
  roleMiddleware(["admin", "manager"]),
  validate(rateIdParamSchema, "params"),
  validate(updateRateSchema),
  PricingController.updateRate
);

// DELETE /api/rates/:id - delete rate (admin only)
router.delete(
  "/:id",
  roleMiddleware(["admin"]),
  validate(rateIdParamSchema, "params"),
  PricingController.deleteRate
);

export default router;