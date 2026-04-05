// @ts-nocheck
import { Request, Response } from "express";
import { HotelService } from "./hotel.service";
import { catchAsync } from "../../utils/catchAsync";
import { ApiResponse, ApiError } from "../../utils/apiResponse";

export class HotelController {
  // Create a new hotel (admin only)
  static createHotel = catchAsync(async (req: Request, res: Response) => {
    const hotel = await HotelService.create(req.body);
    res.status(201).json(new ApiResponse(201, hotel, "Hotel created successfully"));
  });

  // Get all hotels with pagination and filtering
  static getAllHotels = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filter: any = {};

    if (req.query.status) filter.status = req.query.status;
    if (req.query.country) filter.country = req.query.country;
    if (req.query.city) filter.city = req.query.city;

    const result = await HotelService.findAll(filter, page, limit);
    res.status(200).json(new ApiResponse(200, result));
  });

  // Get single hotel by ID
  static getHotelById = catchAsync(async (req: Request, res: Response) => {
    const hotel = await HotelService.findById(req.params.id);
    if (!hotel) throw new ApiError(404, "Hotel not found");
    res.status(200).json(new ApiResponse(200, hotel));
  });

  // Update hotel (admin only)
  static updateHotel = catchAsync(async (req: Request, res: Response) => {
    const updatedHotel = await HotelService.updateById(req.params.id, req.body);
    if (!updatedHotel) throw new ApiError(404, "Hotel not found");
    res.status(200).json(new ApiResponse(200, updatedHotel, "Hotel updated successfully"));
  });

  // Delete hotel (admin only)
  static deleteHotel = catchAsync(async (req: Request, res: Response) => {
    const deleted = await HotelService.deleteById(req.params.id);
    if (!deleted) throw new ApiError(404, "Hotel not found");
    res.status(204).json(new ApiResponse(204, null, "Hotel deleted successfully"));
  });
}