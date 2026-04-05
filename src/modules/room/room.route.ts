import { Router } from "express";
import { RoomController } from "./room.controller";
import { validate } from "../../middlewares/validate.middleware";
import {
  createRoomSchema,
  updateRoomSchema,
  roomIdParamSchema,
  roomQuerySchema,
  updateRoomStatusSchema,
  updateHousekeepingSchema,
} from "./room.validation";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = Router();
router.use(authMiddleware);

router.get(
  "/",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(roomQuerySchema, "query"),
  RoomController.getAllRooms
);

router.get(
  "/:id",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(roomIdParamSchema, "params"),
  RoomController.getRoomById
);

router.post(
  "/",
  roleMiddleware(["admin", "manager"]),
  validate(createRoomSchema),
  RoomController.createRoom
);

router.patch(
  "/:id",
  roleMiddleware(["admin", "manager"]),
  validate(roomIdParamSchema, "params"),
  validate(updateRoomSchema),
  RoomController.updateRoom
);

router.delete(
  "/:id",
  roleMiddleware(["admin"]),
  validate(roomIdParamSchema, "params"),
  RoomController.deleteRoom
);

router.patch(
  "/:id/status",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(roomIdParamSchema, "params"),
  validate(updateRoomStatusSchema),
  RoomController.updateRoomStatus
);

router.patch(
  "/:id/housekeeping",
  roleMiddleware(["admin", "manager", "housekeeping"]),
  validate(roomIdParamSchema, "params"),
  validate(updateHousekeepingSchema),
  RoomController.updateHousekeepingStatus
);

export default router;