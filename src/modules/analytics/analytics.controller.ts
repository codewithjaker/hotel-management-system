import { Request, Response } from "express";
import { AnalyticsService } from "./analytics.service";
import { catchAsync } from "../../utils/catchAsync";
import { ApiResponse, ApiError } from "../../utils/apiResponse";
import { Types } from "mongoose";

export class AnalyticsController {
  static getOccupancyReport = catchAsync(async (req: Request, res: Response) => {
    const { hotelId, startDate, endDate, groupBy } = req.query;
    if (!startDate || !endDate) throw new ApiError(400, "startDate and endDate are required");
    const filter = {
      hotelId: hotelId ? new Types.ObjectId(hotelId as string) : undefined,
      startDate: new Date(startDate as string),
      endDate: new Date(endDate as string),
      groupBy: groupBy as any,
    };
    const report = await AnalyticsService.getOccupancyReport(filter);
    res.status(200).json(new ApiResponse(200, report));
  });

  static getRevenueReport = catchAsync(async (req: Request, res: Response) => {
    const { hotelId, startDate, endDate, groupBy } = req.query;
    if (!startDate || !endDate) throw new ApiError(400, "startDate and endDate are required");
    const filter = {
      hotelId: hotelId ? new Types.ObjectId(hotelId as string) : undefined,
      startDate: new Date(startDate as string),
      endDate: new Date(endDate as string),
      groupBy: groupBy as any,
    };
    const report = await AnalyticsService.getRevenueReport(filter);
    res.status(200).json(new ApiResponse(200, report));
  });

  static getKpiDashboard = catchAsync(async (req: Request, res: Response) => {
    const { hotelId } = req.query;
    const dashboard = await AnalyticsService.getKpiDashboard(hotelId ? new Types.ObjectId(hotelId as string) : undefined);
    res.status(200).json(new ApiResponse(200, dashboard));
  });
}