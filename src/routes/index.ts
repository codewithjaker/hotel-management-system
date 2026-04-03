import { Router } from "express";
import hotelRoutes from "../modules/hotel/hotel.route";

const router = Router();

router.use("/hotels", hotelRoutes);

export default router;
