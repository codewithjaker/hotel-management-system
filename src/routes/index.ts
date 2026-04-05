import { Router } from "express";
import userRoutes from "../modules/user/user.route";
import authRoutes from "../modules/auth/auth.route";
import guestRoutes from "../modules/guest/guest.route";
import hotelRoutes from "../modules/hotel/hotel.route";
import roomTypeRoutes from "../modules/room/roomType.route";
import roomRoutes from "../modules/room/room.route";
import bookingRoutes from "../modules/booking/booking.route";
import pricingRoutes from "../modules/pricing/pricing.route";
import billingRoutes from "../modules/billing/billing.route";
import serviceRoutes from "../modules/service/service.route";
import housekeepingRoutes from "../modules/housekeeping/housekeeping.route";
import maintenanceRoutes from "../modules/maintenance/maintenance.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/guests", guestRoutes);
router.use("/hotels", hotelRoutes);
router.use("/room-types", roomTypeRoutes);
router.use("/rooms", roomRoutes);
router.use("/reservations", bookingRoutes);
router.use("/rates", pricingRoutes);
router.use("/billing", billingRoutes);
router.use("/services", serviceRoutes);
router.use("/housekeeping", housekeepingRoutes);
router.use("/maintenance", maintenanceRoutes);

export default router;