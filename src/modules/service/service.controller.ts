// @ts-nocheck

import { Request, Response } from "express";
import { ServiceService } from "./service.service";
import { catchAsync } from "../../utils/catchAsync";
import { ApiResponse, ApiError } from "../../utils/apiResponse";

export class ServiceController {
  static createService = catchAsync(async (req: Request, res: Response) => {
    const service = await ServiceService.create(req.body);
    res.status(201).json(new ApiResponse(201, service, "Service created"));
  });

  static getAllServices = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filter: any = {};
    if (req.query.hotelId) filter.hotelId = req.query.hotelId;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.isActive) filter.isActive = req.query.isActive === "true";
    const result = await ServiceService.findAll(filter, page, limit);
    res.status(200).json(new ApiResponse(200, result));
  });

  static getServiceById = catchAsync(async (req: Request, res: Response) => {
    const service = await ServiceService.findById(req.params.id);
    if (!service) throw new ApiError(404, "Service not found");
    res.status(200).json(new ApiResponse(200, service));
  });

  static updateService = catchAsync(async (req: Request, res: Response) => {
    const updated = await ServiceService.updateById(req.params.id, req.body);
    if (!updated) throw new ApiError(404, "Service not found");
    res.status(200).json(new ApiResponse(200, updated, "Service updated"));
  });

  static deleteService = catchAsync(async (req: Request, res: Response) => {
    await ServiceService.deleteById(req.params.id);
    res.status(204).json(new ApiResponse(204, null, "Service deleted"));
  });
}