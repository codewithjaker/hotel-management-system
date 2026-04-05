// @ts-nocheck

import { Request, Response } from "express";
import { MaintenanceService } from "./maintenance.service";
import { catchAsync } from "../../utils/catchAsync";
import { ApiResponse, ApiError } from "../../utils/apiResponse";
import { Types } from "mongoose";

export class MaintenanceController {
  static createIssue = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const issue = await MaintenanceService.createIssue({
      ...req.body,
      reportedBy: new Types.ObjectId(userId),
    });
    res.status(201).json(new ApiResponse(201, issue, "Maintenance issue reported"));
  });

  static getAllIssues = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filter: any = {};
    if (req.query.hotelId) filter.hotelId = req.query.hotelId;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.issueType) filter.issueType = req.query.issueType;
    if (req.query.roomId) filter.roomId = req.query.roomId;
    if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;
    const result = await MaintenanceService.getAllIssues(filter, page, limit);
    res.status(200).json(new ApiResponse(200, result));
  });

  static getIssueById = catchAsync(async (req: Request, res: Response) => {
    const issue = await MaintenanceService.getIssueById(req.params.id);
    if (!issue) throw new ApiError(404, "Maintenance issue not found");
    res.status(200).json(new ApiResponse(200, issue));
  });

  static updateIssue = catchAsync(async (req: Request, res: Response) => {
    const updated = await MaintenanceService.updateIssue(req.params.id, req.body);
    if (!updated) throw new ApiError(404, "Issue not found");
    res.status(200).json(new ApiResponse(200, updated, "Issue updated"));
  });

  static deleteIssue = catchAsync(async (req: Request, res: Response) => {
    await MaintenanceService.deleteIssue(req.params.id);
    res.status(204).json(new ApiResponse(204, null, "Issue deleted"));
  });

  static assignIssue = catchAsync(async (req: Request, res: Response) => {
    const { assignedTo } = req.body;
    const updated = await MaintenanceService.assignIssue(req.params.id, new Types.ObjectId(assignedTo));
    if (!updated) throw new ApiError(404, "Issue not found");
    res.status(200).json(new ApiResponse(200, updated, "Issue assigned"));
  });

  static resolveIssue = catchAsync(async (req: Request, res: Response) => {
    const { cost, notes } = req.body;
    const updated = await MaintenanceService.resolveIssue(req.params.id, cost, notes);
    if (!updated) throw new ApiError(404, "Issue not found");
    res.status(200).json(new ApiResponse(200, updated, "Issue resolved"));
  });

  static closeIssue = catchAsync(async (req: Request, res: Response) => {
    const updated = await MaintenanceService.closeIssue(req.params.id);
    if (!updated) throw new ApiError(404, "Issue not found");
    res.status(200).json(new ApiResponse(200, updated, "Issue closed"));
  });
}