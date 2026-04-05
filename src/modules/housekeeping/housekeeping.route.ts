import { Router } from "express";
import { HousekeepingController } from "./housekeeping.controller";
import { validate } from "../../middlewares/validate.middleware";
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema,
  taskQuerySchema,
  completeTaskSchema,
  inspectTaskSchema,
} from "./housekeeping.validation";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = Router();
router.use(authMiddleware);

// GET /api/housekeeping - list tasks
router.get(
  "/",
  roleMiddleware(["admin", "manager", "housekeeping", "receptionist"]),
  validate(taskQuerySchema, "query"),
  HousekeepingController.getAllTasks
);

// GET /api/housekeeping/:id - get single task
router.get(
  "/:id",
  roleMiddleware(["admin", "manager", "housekeeping", "receptionist"]),
  validate(taskIdParamSchema, "params"),
  HousekeepingController.getTaskById
);

// POST /api/housekeeping - create task
router.post(
  "/",
  roleMiddleware(["admin", "manager"]),
  validate(createTaskSchema),
  HousekeepingController.createTask
);

// PATCH /api/housekeeping/:id - update task (assign, reschedule, notes)
router.patch(
  "/:id",
  roleMiddleware(["admin", "manager"]),
  validate(taskIdParamSchema, "params"),
  validate(updateTaskSchema),
  HousekeepingController.updateTask
);

// DELETE /api/housekeeping/:id - delete task
router.delete(
  "/:id",
  roleMiddleware(["admin"]),
  validate(taskIdParamSchema, "params"),
  HousekeepingController.deleteTask
);

// POST /api/housekeeping/:id/start - start task
router.post(
  "/:id/start",
  roleMiddleware(["admin", "manager", "housekeeping"]),
  validate(taskIdParamSchema, "params"),
  HousekeepingController.startTask
);

// POST /api/housekeeping/:id/complete - complete task
router.post(
  "/:id/complete",
  roleMiddleware(["admin", "manager", "housekeeping"]),
  validate(taskIdParamSchema, "params"),
  validate(completeTaskSchema),
  HousekeepingController.completeTask
);

// POST /api/housekeeping/:id/inspect - inspect completed task
router.post(
  "/:id/inspect",
  roleMiddleware(["admin", "manager"]),
  validate(taskIdParamSchema, "params"),
  validate(inspectTaskSchema),
  HousekeepingController.inspectTask
);

export default router;