import { Router } from "express";
import { BookingController } from "./booking.controller";
import { validate } from "../../middlewares/validate.middleware";
import {
  createReservationSchema,
  updateReservationSchema,
  reservationIdParamSchema,
  reservationQuerySchema,
  cancelReservationSchema,
  checkInOutSchema,
} from "./booking.validation";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = Router();
router.use(authMiddleware);

// GET /api/reservations
router.get(
  "/",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(reservationQuerySchema, "query"),
  BookingController.getAllReservations
);

// GET /api/reservations/:id
router.get(
  "/:id",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(reservationIdParamSchema, "params"),
  BookingController.getReservationById
);

// POST /api/reservations
router.post(
  "/",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(createReservationSchema),
  BookingController.createReservation
);

// PATCH /api/reservations/:id
router.patch(
  "/:id",
  roleMiddleware(["admin", "manager"]),
  validate(reservationIdParamSchema, "params"),
  validate(updateReservationSchema),
  BookingController.updateReservation
);

// DELETE /api/reservations/:id (only cancelled/no-show)
router.delete(
  "/:id",
  roleMiddleware(["admin"]),
  validate(reservationIdParamSchema, "params"),
  BookingController.deleteReservation
);

// POST /api/reservations/:id/cancel
router.post(
  "/:id/cancel",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(reservationIdParamSchema, "params"),
  validate(cancelReservationSchema),
  BookingController.cancelReservation
);

// POST /api/reservations/:id/check-in
router.post(
  "/:id/check-in",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(reservationIdParamSchema, "params"),
  validate(checkInOutSchema),
  BookingController.checkIn
);

// POST /api/reservations/:id/check-out
router.post(
  "/:id/check-out",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(reservationIdParamSchema, "params"),
  validate(checkInOutSchema),
  BookingController.checkOut
);

export default router;