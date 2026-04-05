import { Router } from "express";
import { RoomTypeController } from "./roomType.controller";
import { validate } from "../../middlewares/validate.middleware";
import {
  createRoomTypeSchema,
  updateRoomTypeSchema,
  roomTypeIdParamSchema,
  roomTypeQuerySchema,
} from "./roomType.validation";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = Router();
router.use(authMiddleware);

router.get(
  "/",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(roomTypeQuerySchema, "query"),
  RoomTypeController.getAllRoomTypes
);

router.get(
  "/:id",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(roomTypeIdParamSchema, "params"),
  RoomTypeController.getRoomTypeById
);

router.post(
  "/",
  roleMiddleware(["admin", "manager"]),
  validate(createRoomTypeSchema),
  RoomTypeController.createRoomType
);

router.patch(
  "/:id",
  roleMiddleware(["admin", "manager"]),
  validate(roomTypeIdParamSchema, "params"),
  validate(updateRoomTypeSchema),
  RoomTypeController.updateRoomType
);

router.delete(
  "/:id",
  roleMiddleware(["admin"]),
  validate(roomTypeIdParamSchema, "params"),
  RoomTypeController.deleteRoomType
);

export default router;