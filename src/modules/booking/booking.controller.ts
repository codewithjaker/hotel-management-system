// @ts-nocheck

import { Request, Response } from "express";
import { BookingService } from "./booking.service";
import { catchAsync } from "../../utils/catchAsync";
import { ApiResponse, ApiError } from "../../utils/apiResponse";
import { Types } from "mongoose";

export class BookingController {
  static createReservation = catchAsync(async (req: Request, res: Response) => {
    const reservation = await BookingService.createReservation({
      hotelId: new Types.ObjectId(req.body.hotelId),
      guestId: new Types.ObjectId(req.body.guestId),
      checkInDate: new Date(req.body.checkInDate),
      checkOutDate: new Date(req.body.checkOutDate),
      rooms: req.body.rooms,
      source: req.body.source,
      specialRequests: req.body.specialRequests,
    });
    res.status(201).json(new ApiResponse(201, reservation, "Reservation created"));
  });

  static getAllReservations = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filter: any = {};
    if (req.query.hotelId) filter.hotelId = req.query.hotelId;
    if (req.query.guestId) filter.guestId = req.query.guestId;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.startDate && req.query.endDate) {
      filter.checkInDate = { $gte: new Date(req.query.startDate as string) };
      filter.checkOutDate = { $lte: new Date(req.query.endDate as string) };
    }
    const result = await BookingService.getAllReservations(filter, page, limit);
    res.status(200).json(new ApiResponse(200, result));
  });

  static getReservationById = catchAsync(async (req: Request, res: Response) => {
    const reservation = await BookingService.getReservationById(req.params.id);
    if (!reservation) throw new ApiError(404, "Reservation not found");
    res.status(200).json(new ApiResponse(200, reservation));
  });

  static updateReservation = catchAsync(async (req: Request, res: Response) => {
    const updated = await BookingService.updateReservation(req.params.id, req.body);
    if (!updated) throw new ApiError(404, "Reservation not found");
    res.status(200).json(new ApiResponse(200, updated, "Reservation updated"));
  });

  static cancelReservation = catchAsync(async (req: Request, res: Response) => {
    const { reason } = req.body;
    const cancelled = await BookingService.cancelReservation(req.params.id, reason);
    if (!cancelled) throw new ApiError(404, "Reservation not found");
    res.status(200).json(new ApiResponse(200, cancelled, "Reservation cancelled"));
  });

  static deleteReservation = catchAsync(async (req: Request, res: Response) => {
    await BookingService.deleteReservation(req.params.id);
    res.status(204).json(new ApiResponse(204, null, "Reservation deleted"));
  });

  static checkIn = catchAsync(async (req: Request, res: Response) => {
    const result = await BookingService.checkIn(req.params.id, req.body.actualCheckInTime ? new Date(req.body.actualCheckInTime) : undefined);
    res.status(200).json(new ApiResponse(200, result, "Checked in successfully"));
  });

  static checkOut = catchAsync(async (req: Request, res: Response) => {
    const result = await BookingService.checkOut(req.params.id, req.body.actualCheckOutTime ? new Date(req.body.actualCheckOutTime) : undefined);
    res.status(200).json(new ApiResponse(200, result, "Checked out successfully"));
  });
}