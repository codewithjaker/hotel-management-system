import { Router } from "express";
import { GuestController } from "./guest.controller";
import { validate } from "../../middlewares/validate.middleware";
import {
  createGuestSchema,
  updateGuestSchema,
  guestIdParamSchema,
  guestQuerySchema,
} from "./guest.validation";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = Router();

// All guest routes require authentication
router.use(authMiddleware);

// GET /api/guests - list guests (receptionist and above)
router.get(
  "/",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(guestQuerySchema, "query"),
  GuestController.getAllGuests
);

// GET /api/guests/:id - get single guest
router.get(
  "/:id",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(guestIdParamSchema, "params"),
  GuestController.getGuestById
);

// GET /api/guests/:id/bookings - get guest with booking history
router.get(
  "/:id/bookings",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(guestIdParamSchema, "params"),
  GuestController.getGuestWithBookings
);

// POST /api/guests - create new guest
router.post(
  "/",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(createGuestSchema),
  GuestController.createGuest
);

// PATCH /api/guests/:id - update guest
router.patch(
  "/:id",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(guestIdParamSchema, "params"),
  validate(updateGuestSchema),
  GuestController.updateGuest
);

// DELETE /api/guests/:id - delete guest (admin only)
router.delete(
  "/:id",
  roleMiddleware(["admin"]),
  validate(guestIdParamSchema, "params"),
  GuestController.deleteGuest
);

export default router;