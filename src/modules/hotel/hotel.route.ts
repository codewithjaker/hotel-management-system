import { Router } from "express";
import * as controller from "./hotel.controller";

const router = Router();

router.post("/", controller.createHotel);
router.get("/", controller.getHotels);

export default router;
