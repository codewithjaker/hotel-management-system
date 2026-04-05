// @ts-nocheck
import { Request, Response } from "express";
import { GuestService } from "./guest.service";
import { catchAsync } from "../../utils/catchAsync";
import { ApiResponse, ApiError } from "../../utils/apiResponse";

export class GuestController {
  // Create a new guest
  static createGuest = catchAsync(async (req: Request, res: Response) => {
    const guest = await GuestService.create(req.body);
    res.status(201).json(new ApiResponse(201, guest, "Guest created successfully"));
  });

  // Get all guests with pagination and filtering
  static getAllGuests = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filter: any = {};

    // Apply filters
    if (req.query.nationality) filter.nationality = req.query.nationality;
    if (req.query.country) filter.country = req.query.country;
    if (req.query.idType) filter.idType = req.query.idType;

    // Search query (if provided)
    let result;
    if (req.query.search) {
      result = await GuestService.search(req.query.search as string, page, limit);
    } else {
      result = await GuestService.findAll(filter, page, limit);
    }
    res.status(200).json(new ApiResponse(200, result));
  });

  // Get single guest by ID
  static getGuestById = catchAsync(async (req: Request, res: Response) => {
    const guest = await GuestService.findById(req.params.id);
    if (!guest) throw new ApiError(404, "Guest not found");
    res.status(200).json(new ApiResponse(200, guest));
  });

  // Get guest with their booking history
  static getGuestWithBookings = catchAsync(async (req: Request, res: Response) => {
    const guestWithBookings = await GuestService.getGuestWithBookings(req.params.id);
    if (!guestWithBookings) throw new ApiError(404, "Guest not found");
    res.status(200).json(new ApiResponse(200, guestWithBookings));
  });

  // Update guest
  static updateGuest = catchAsync(async (req: Request, res: Response) => {
    const updatedGuest = await GuestService.updateById(req.params.id, req.body);
    if (!updatedGuest) throw new ApiError(404, "Guest not found");
    res.status(200).json(new ApiResponse(200, updatedGuest, "Guest updated successfully"));
  });

  // Delete guest
  static deleteGuest = catchAsync(async (req: Request, res: Response) => {
    const deleted = await GuestService.deleteById(req.params.id);
    if (!deleted) throw new ApiError(404, "Guest not found");
    res.status(204).json(new ApiResponse(204, null, "Guest deleted successfully"));
  });
}