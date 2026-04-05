// @ts-nocheck

import { Request, Response } from "express";
import { ServiceUsageService } from "./serviceUsage.service";
import { catchAsync } from "../../utils/catchAsync";
import { ApiResponse, ApiError } from "../../utils/apiResponse";
import { Types } from "mongoose";

export class ServiceUsageController {
  static addServiceToStay = catchAsync(async (req: Request, res: Response) => {
    const { stayId, serviceId, quantity, usedAt } = req.body;
    const usage = await ServiceUsageService.addServiceToStay(
      new Types.ObjectId(stayId),
      new Types.ObjectId(serviceId),
      quantity,
      usedAt ? new Date(usedAt) : undefined
    );
    res.status(201).json(new ApiResponse(201, usage, "Service added to stay"));
  });

  static getUsagesByStay = catchAsync(async (req: Request, res: Response) => {
    const usages = await ServiceUsageService.getUsagesByStay(new Types.ObjectId(req.params.stayId));
    res.status(200).json(new ApiResponse(200, usages));
  });

  static getAllUsages = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filter: any = {};
    if (req.query.stayId) filter.stayId = req.query.stayId;
    if (req.query.serviceId) filter.serviceId = req.query.serviceId;
    if (req.query.hotelId) filter.hotelId = req.query.hotelId;
    const result = await ServiceUsageService.getAllUsages(filter, page, limit);
    res.status(200).json(new ApiResponse(200, result));
  });

  static getUsageById = catchAsync(async (req: Request, res: Response) => {
    const usage = await ServiceUsageService.getUsageById(req.params.id);
    if (!usage) throw new ApiError(404, "Service usage not found");
    res.status(200).json(new ApiResponse(200, usage));
  });

  static updateUsage = catchAsync(async (req: Request, res: Response) => {
    const { quantity, usedAt } = req.body;
    const updated = await ServiceUsageService.updateUsage(req.params.id, { quantity, usedAt });
    if (!updated) throw new ApiError(404, "Service usage not found");
    res.status(200).json(new ApiResponse(200, updated, "Service usage updated"));
  });

  static deleteUsage = catchAsync(async (req: Request, res: Response) => {
    await ServiceUsageService.deleteUsage(req.params.id);
    res.status(204).json(new ApiResponse(204, null, "Service usage deleted"));
  });
}