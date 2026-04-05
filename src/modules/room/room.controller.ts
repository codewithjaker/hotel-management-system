//@ts-nocheck

import { Request, Response } from "express";
import { RoomService } from "./room.service";
import { catchAsync } from "../../utils/catchAsync";
import { ApiResponse, ApiError } from "../../utils/apiResponse";

export class RoomController {
  static createRoom = catchAsync(async (req: Request, res: Response) => {
    const room = await RoomService.create(req.body);
    res.status(201).json(new ApiResponse(201, room, "Room created"));
  });

  static getAllRooms = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filter: any = {};
    if (req.query.hotelId) filter.hotelId = req.query.hotelId;
    if (req.query.roomTypeId) filter.roomTypeId = req.query.roomTypeId;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.housekeepingStatus) filter.housekeepingStatus = req.query.housekeepingStatus;
    const result = await RoomService.findAll(filter, page, limit);
    res.status(200).json(new ApiResponse(200, result));
  });

  static getRoomById = catchAsync(async (req: Request, res: Response) => {
    const room = await RoomService.findById(req.params.id);
    if (!room) throw new ApiError(404, "Room not found");
    res.status(200).json(new ApiResponse(200, room));
  });

  static updateRoom = catchAsync(async (req: Request, res: Response) => {
    const updated = await RoomService.updateById(req.params.id, req.body);
    if (!updated) throw new ApiError(404, "Room not found");
    res.status(200).json(new ApiResponse(200, updated, "Room updated"));
  });

  static deleteRoom = catchAsync(async (req: Request, res: Response) => {
    await RoomService.deleteById(req.params.id);
    res.status(204).json(new ApiResponse(204, null, "Room deleted"));
  });

  static updateRoomStatus = catchAsync(async (req: Request, res: Response) => {
    const { status } = req.body;
    const updated = await RoomService.updateStatus(req.params.id, status);
    if (!updated) throw new ApiError(404, "Room not found");
    res.status(200).json(new ApiResponse(200, updated, "Room status updated"));
  });

  static updateHousekeepingStatus = catchAsync(async (req: Request, res: Response) => {
    const { housekeepingStatus } = req.body;
    const updated = await RoomService.updateHousekeepingStatus(req.params.id, housekeepingStatus);
    if (!updated) throw new ApiError(404, "Room not found");
    res.status(200).json(new ApiResponse(200, updated, "Housekeeping status updated"));
  });
}