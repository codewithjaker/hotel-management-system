// @ts-nocheck
import { Request, Response } from "express";
import { PricingService } from "./pricing.service";
import { catchAsync } from "../../utils/catchAsync";
import { ApiResponse, ApiError } from "../../utils/apiResponse";
import { Types } from "mongoose";

export class PricingController {
  static createRate = catchAsync(async (req: Request, res: Response) => {
    const rate = await PricingService.createRate(req.body);
    res.status(201).json(new ApiResponse(201, rate, "Rate created"));
  });

  static bulkCreateRates = catchAsync(async (req: Request, res: Response) => {
    const { hotelId, roomTypeId, startDate, endDate, price, inventory, overwrite } = req.body;
    const result = await PricingService.bulkCreateRates(
      new Types.ObjectId(hotelId),
      new Types.ObjectId(roomTypeId),
      new Date(startDate),
      new Date(endDate),
      price,
      inventory,
      overwrite
    );
    res.status(200).json(new ApiResponse(200, result, "Bulk rates processed"));
  });

  static getAllRates = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filter: any = {};
    if (req.query.hotelId) filter.hotelId = req.query.hotelId;
    if (req.query.roomTypeId) filter.roomTypeId = req.query.roomTypeId;
    if (req.query.startDate && req.query.endDate) {
      filter.date = {
        $gte: new Date(req.query.startDate as string),
        $lte: new Date(req.query.endDate as string),
      };
    }
    if (req.query.isActive) filter.isActive = req.query.isActive === "true";
    const result = await PricingService.getAllRates(filter, page, limit);
    res.status(200).json(new ApiResponse(200, result));
  });

  static getRateById = catchAsync(async (req: Request, res: Response) => {
    const rate = await PricingService.getRateById(req.params.id);
    if (!rate) throw new ApiError(404, "Rate not found");
    res.status(200).json(new ApiResponse(200, rate));
  });

  static updateRate = catchAsync(async (req: Request, res: Response) => {
    const updated = await PricingService.updateRate(req.params.id, req.body);
    if (!updated) throw new ApiError(404, "Rate not found");
    res.status(200).json(new ApiResponse(200, updated, "Rate updated"));
  });

  static deleteRate = catchAsync(async (req: Request, res: Response) => {
    const deleted = await PricingService.deleteRate(req.params.id);
    if (!deleted) throw new ApiError(404, "Rate not found");
    res.status(204).json(new ApiResponse(204, null, "Rate deleted"));
  });
}