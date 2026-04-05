import { Router } from "express";
import { HotelController } from "./hotel.controller";
import { validate } from "../../middlewares/validate.middleware";
import {
  createHotelSchema,
  updateHotelSchema,
  hotelIdParamSchema,
  hotelQuerySchema,
} from "./hotel.validation";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { roleMiddleware } from "../../middlewares/role.middleware";

const router = Router();

// All hotel routes require authentication
router.use(authMiddleware);

// GET /api/hotels - list hotels (all authenticated users)
router.get(
  "/",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(hotelQuerySchema, "query"),
  HotelController.getAllHotels
);

// GET /api/hotels/:id - get single hotel
router.get(
  "/:id",
  roleMiddleware(["admin", "manager", "receptionist"]),
  validate(hotelIdParamSchema, "params"),
  HotelController.getHotelById
);

// POST /api/hotels - create hotel (admin only)
router.post(
  "/",
  roleMiddleware(["admin"]),
  validate(createHotelSchema),
  HotelController.createHotel
);

// PATCH /api/hotels/:id - update hotel (admin only)
router.patch(
  "/:id",
  roleMiddleware(["admin"]),
  validate(hotelIdParamSchema, "params"),
  validate(updateHotelSchema),
  HotelController.updateHotel
);

// DELETE /api/hotels/:id - delete hotel (admin only)
router.delete(
  "/:id",
  roleMiddleware(["admin"]),
  validate(hotelIdParamSchema, "params"),
  HotelController.deleteHotel
);

export default router;