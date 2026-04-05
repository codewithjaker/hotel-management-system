import { Router } from "express";
import { AnalyticsController } from "./analytics.controller";
import { validate } from "../../middlewares/validate.middleware";
import { reportQuerySchema, dashboardQuerySchema } from "./analytics.validation";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = Router();
router.use(authMiddleware);

// GET /api/analytics/occupancy - occupancy report
router.get(
  "/occupancy",
  roleMiddleware(["admin", "manager"]),
  validate(reportQuerySchema, "query"),
  AnalyticsController.getOccupancyReport
);

// GET /api/analytics/revenue - revenue report
router.get(
  "/revenue",
  roleMiddleware(["admin", "manager"]),
  validate(reportQuerySchema, "query"),
  AnalyticsController.getRevenueReport
);

// GET /api/analytics/dashboard - KPI dashboard
router.get(
  "/dashboard",
  roleMiddleware(["admin", "manager"]),
  validate(dashboardQuerySchema, "query"),
  AnalyticsController.getKpiDashboard
);

export default router;