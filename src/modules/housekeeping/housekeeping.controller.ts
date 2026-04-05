// @ts-nocheck

import { Request, Response } from "express";
import { HousekeepingService } from "./housekeeping.service";
import { catchAsync } from "../../utils/catchAsync";
import { ApiResponse, ApiError } from "../../utils/apiResponse";
import { Types } from "mongoose";

export class HousekeepingController {
  static createTask = catchAsync(async (req: Request, res: Response) => {
    const task = await HousekeepingService.createTask(req.body);
    res.status(201).json(new ApiResponse(201, task, "Housekeeping task created"));
  });

  static getAllTasks = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filter: any = {};
    if (req.query.hotelId) filter.hotelId = req.query.hotelId;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.assignedTo) filter.assignedTo = req.query.assignedTo;
    if (req.query.roomId) filter.roomId = req.query.roomId;
    const result = await HousekeepingService.getAllTasks(filter, page, limit);
    res.status(200).json(new ApiResponse(200, result));
  });

  static getTaskById = catchAsync(async (req: Request, res: Response) => {
    const task = await HousekeepingService.getTaskById(req.params.id);
    if (!task) throw new ApiError(404, "Housekeeping task not found");
    res.status(200).json(new ApiResponse(200, task));
  });

  static updateTask = catchAsync(async (req: Request, res: Response) => {
    const updated = await HousekeepingService.updateTask(req.params.id, req.body);
    if (!updated) throw new ApiError(404, "Task not found");
    res.status(200).json(new ApiResponse(200, updated, "Task updated"));
  });

  static deleteTask = catchAsync(async (req: Request, res: Response) => {
    await HousekeepingService.deleteTask(req.params.id);
    res.status(204).json(new ApiResponse(204, null, "Task deleted"));
  });

  static startTask = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const started = await HousekeepingService.startTask(req.params.id, new Types.ObjectId(userId));
    if (!started) throw new ApiError(404, "Task not found");
    res.status(200).json(new ApiResponse(200, started, "Task started"));
  });

  static completeTask = catchAsync(async (req: Request, res: Response) => {
    const { notes } = req.body;
    const result = await HousekeepingService.completeTask(req.params.id, notes);
    res.status(200).json(new ApiResponse(200, result, "Task completed and room marked clean"));
  });

  static inspectTask = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { passed, notes } = req.body;
    const inspected = await HousekeepingService.inspectTask(
      req.params.id,
      new Types.ObjectId(userId),
      passed,
      notes
    );
    if (!inspected) throw new ApiError(404, "Task not found");
    const message = passed ? "Task inspected and approved" : "Task inspection failed, task reopened";
    res.status(200).json(new ApiResponse(200, inspected, message));
  });
}