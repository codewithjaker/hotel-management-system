//@ts-nocheck
import { Request, Response } from "express";
import { RoomTypeService } from "./roomType.service";
import { catchAsync } from "../../utils/catchAsync";
import { ApiResponse, ApiError } from "../../utils/apiResponse";

export class RoomTypeController {
  static createRoomType = catchAsync(async (req: Request, res: Response) => {
    const roomType = await RoomTypeService.create(req.body);
    res.status(201).json(new ApiResponse(201, roomType, "Room type created"));
  });

  static getAllRoomTypes = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filter: any = {};
    if (req.query.hotelId) filter.hotelId = req.query.hotelId;
    if (req.query.isActive) filter.isActive = req.query.isActive === "true";
    const result = await RoomTypeService.findAll(filter, page, limit);
    res.status(200).json(new ApiResponse(200, result));
  });

  static getRoomTypeById = catchAsync(async (req: Request, res: Response) => {
    const roomType = await RoomTypeService.findById(req.params.id);
    if (!roomType) throw new ApiError(404, "Room type not found");
    res.status(200).json(new ApiResponse(200, roomType));
  });

  static updateRoomType = catchAsync(async (req: Request, res: Response) => {
    const updated = await RoomTypeService.updateById(req.params.id, req.body);
    if (!updated) throw new ApiError(404, "Room type not found");
    res.status(200).json(new ApiResponse(200, updated, "Room type updated"));
  });

  static deleteRoomType = catchAsync(async (req: Request, res: Response) => {
    await RoomTypeService.deleteById(req.params.id);
    res.status(204).json(new ApiResponse(204, null, "Room type deleted"));
  });
}