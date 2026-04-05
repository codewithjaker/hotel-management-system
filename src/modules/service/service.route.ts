import { Router } from "express";
import { ServiceController } from "./service.controller";
import { ServiceUsageController } from "./serviceUsage.controller";
import { validate } from "../../middlewares/validate.middleware";
import {
  createServiceSchema,
  updateServiceSchema,
  serviceIdParamSchema,
  serviceQuerySchema,
  createServiceUsageSchema,
  updateServiceUsageSchema,
  stayIdParamSchema,
  serviceUsageIdParamSchema,
  serviceUsageQuerySchema,
} from "./service.validation";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = Router();
router.use(authMiddleware);

// Service CRUD
router.get(
  "/",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(serviceQuerySchema, "query"),
  ServiceController.getAllServices
);

router.get(
  "/:id",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(serviceIdParamSchema, "params"),
  ServiceController.getServiceById
);

router.post(
  "/",
  roleMiddleware(["admin", "manager"]),
  validate(createServiceSchema),
  ServiceController.createService
);

router.patch(
  "/:id",
  roleMiddleware(["admin", "manager"]),
  validate(serviceIdParamSchema, "params"),
  validate(updateServiceSchema),
  ServiceController.updateService
);

router.delete(
  "/:id",
  roleMiddleware(["admin"]),
  validate(serviceIdParamSchema, "params"),
  ServiceController.deleteService
);

// Service Usage endpoints
router.get(
  "/usages",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(serviceUsageQuerySchema, "query"),
  ServiceUsageController.getAllUsages
);

router.get(
  "/usages/by-stay/:stayId",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(stayIdParamSchema, "params"),
  ServiceUsageController.getUsagesByStay
);

router.get(
  "/usages/:id",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(serviceUsageIdParamSchema, "params"),
  ServiceUsageController.getUsageById
);

router.post(
  "/usages",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(createServiceUsageSchema),
  ServiceUsageController.addServiceToStay
);

router.patch(
  "/usages/:id",
  roleMiddleware(["admin", "manager"]),
  validate(serviceUsageIdParamSchema, "params"),
  validate(updateServiceUsageSchema),
  ServiceUsageController.updateUsage
);

router.delete(
  "/usages/:id",
  roleMiddleware(["admin", "manager"]),
  validate(serviceUsageIdParamSchema, "params"),
  ServiceUsageController.deleteUsage
);

export default router;