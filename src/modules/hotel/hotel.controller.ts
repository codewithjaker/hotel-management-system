import { Request, Response } from "express";
import * as hotelService from "./hotel.service";

export const createHotel = async (req: Request, res: Response) => {
  const result = await hotelService.createHotel(req.body);
  res.status(201).json({ success: true, data: result });
};

export const getHotels = async (_req: Request, res: Response) => {
  const result = await hotelService.getHotels();
  res.json({ success: true, data: result });
};
