import { Router } from "express";
import userRoutes from "../modules/user/user.route";
import authRoutes from "../modules/auth/auth.route";
import guestRoutes from "../modules/guest/guest.route";
import hotelRoutes from "../modules/hotel/hotel.route";
import roomTypeRoutes from "../modules/room/roomType.route";
import roomRoutes from "../modules/room/room.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/guests", guestRoutes);
router.use("/hotels", hotelRoutes);
router.use("/room-types", roomTypeRoutes);
router.use("/rooms", roomRoutes);

export default router;