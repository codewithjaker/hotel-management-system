import { Router } from "express";
import { MaintenanceController } from "./maintenance.controller";
import { validate } from "../../middlewares/validate.middleware";
import {
  createIssueSchema,
  updateIssueSchema,
  issueIdParamSchema,
  issueQuerySchema,
  assignIssueSchema,
  resolveIssueSchema,
} from "./maintenance.validation";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = Router();
router.use(authMiddleware);

// GET /api/maintenance - list issues
router.get(
  "/",
  roleMiddleware(["admin", "manager", "maintenance", "receptionist"]),
  validate(issueQuerySchema, "query"),
  MaintenanceController.getAllIssues
);

// GET /api/maintenance/:id - get single issue
router.get(
  "/:id",
  roleMiddleware(["admin", "manager", "maintenance", "receptionist"]),
  validate(issueIdParamSchema, "params"),
  MaintenanceController.getIssueById
);

// POST /api/maintenance - create issue
router.post(
  "/",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(createIssueSchema),
  MaintenanceController.createIssue
);

// PATCH /api/maintenance/:id - update issue (description, priority, etc.)
router.patch(
  "/:id",
  roleMiddleware(["admin", "manager"]),
  validate(issueIdParamSchema, "params"),
  validate(updateIssueSchema),
  MaintenanceController.updateIssue
);

// DELETE /api/maintenance/:id - delete issue (admin only)
router.delete(
  "/:id",
  roleMiddleware(["admin"]),
  validate(issueIdParamSchema, "params"),
  MaintenanceController.deleteIssue
);

// POST /api/maintenance/:id/assign - assign to staff
router.post(
  "/:id/assign",
  roleMiddleware(["admin", "manager"]),
  validate(issueIdParamSchema, "params"),
  validate(assignIssueSchema),
  MaintenanceController.assignIssue
);

// POST /api/maintenance/:id/resolve - mark as resolved
router.post(
  "/:id/resolve",
  roleMiddleware(["admin", "manager", "maintenance"]),
  validate(issueIdParamSchema, "params"),
  validate(resolveIssueSchema),
  MaintenanceController.resolveIssue
);

// POST /api/maintenance/:id/close - close issue (revert room status if no other issues)
router.post(
  "/:id/close",
  roleMiddleware(["admin", "manager"]),
  validate(issueIdParamSchema, "params"),
  MaintenanceController.closeIssue
);

export default router;