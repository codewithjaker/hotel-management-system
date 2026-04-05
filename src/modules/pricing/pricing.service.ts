import { Types, startSession } from "mongoose";
import { RoomRate } from "./rate.model";
import { IRoomRate } from "./pricing.interface";
import { RoomType } from "../room/roomType.model";
import { ApiError } from "../../utils/apiResponse";

export class PricingService {
  // Create a single rate
  static async createRate(rateData: Partial<IRoomRate>): Promise<IRoomRate> {
    // Validate room type exists and belongs to hotel
    const roomType = await RoomType.findOne({
      _id: rateData.roomTypeId,
      hotelId: rateData.hotelId,
    });
    if (!roomType) throw new ApiError(404, "Room type not found in this hotel");
    // Check for existing rate on same date
    const existing = await RoomRate.findOne({
      roomTypeId: rateData.roomTypeId,
      date: rateData.date,
    });
    if (existing) throw new ApiError(409, "Rate already exists for this date");
    const rate = await RoomRate.create(rateData);
    return rate.toJSON();
  }

  // Bulk create/update rates for a date range
  static async bulkCreateRates(
    hotelId: Types.ObjectId,
    roomTypeId: Types.ObjectId,
    startDate: Date,
    endDate: Date,
    price: number,
    inventory?: number,
    overwrite = false
  ): Promise<{ created: number; updated: number }> {
    const roomType = await RoomType.findOne({ _id: roomTypeId, hotelId });
    if (!roomType) throw new ApiError(404, "Room type not found");
    const dates: Date[] = [];
    let current = new Date(startDate);
    while (current <= endDate) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    let created = 0,
      updated = 0;
    const session = await startSession();
    session.startTransaction();
    try {
      for (const date of dates) {
        const existing = await RoomRate.findOne({ roomTypeId, date }).session(session);
        if (existing) {
          if (overwrite) {
            existing.price = price;
            if (inventory !== undefined) existing.inventory = inventory;
            existing.isActive = true;
            await existing.save({ session });
            updated++;
          }
        } else {
          await RoomRate.create([{
            hotelId,
            roomTypeId,
            date,
            price,
            inventory: inventory ?? null,
            isActive: true,
          }], { session });
          created++;
        }
      }
      await session.commitTransaction();
      return { created, updated };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async getRateById(id: string | Types.ObjectId): Promise<IRoomRate | null> {
    return RoomRate.findById(id).populate("roomTypeId").lean();
  }

  static async getAllRates(
    filter: Record<string, any> = {},
    page = 1,
    limit = 10,
    sort: Record<string, 1 | -1> = { date: 1 }
  ): Promise<{ rates: IRoomRate[]; total: number }> {
    const skip = (page - 1) * limit;
    const [rates, total] = await Promise.all([
      RoomRate.find(filter)
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .populate("roomTypeId", "name")
        .lean(),
      RoomRate.countDocuments(filter),
    ]);
    return { rates, total };
  }

  static async updateRate(
    id: string | Types.ObjectId,
    updateData: Partial<IRoomRate>
  ): Promise<IRoomRate | null> {
    // Prevent changing hotelId or roomTypeId as that would break uniqueness
    delete (updateData as any).hotelId;
    delete (updateData as any).roomTypeId;
    const rate = await RoomRate.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();
    return rate;
  }

  static async deleteRate(id: string | Types.ObjectId): Promise<boolean> {
    const result = await RoomRate.findByIdAndDelete(id);
    return !!result;
  }

  // Get price for a specific room type on a date range (used by booking)
  static async calculatePrice(
    hotelId: Types.ObjectId,
    roomTypeId: Types.ObjectId,
    checkInDate: Date,
    checkOutDate: Date
  ): Promise<number> {
    const roomType = await RoomType.findById(roomTypeId);
    if (!roomType) throw new Error("Room type not found");
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    let total = 0;
    for (let i = 0; i < nights; i++) {
      const currentDate = new Date(checkInDate);
      currentDate.setDate(checkInDate.getDate() + i);
      const rate = await RoomRate.findOne({
        hotelId,
        roomTypeId,
        date: {
          $gte: new Date(currentDate.setHours(0, 0, 0, 0)),
          $lt: new Date(currentDate.setHours(23, 59, 59, 999)),
        },
        isActive: true,
      });
      const dailyPrice = rate ? rate.price : roomType.basePrice;
      total += dailyPrice;
    }
    return total / nights; // average per night
  }

  // Get available inventory for a room type on a date (for availability checks)
  static async getAvailableInventory(
    hotelId: Types.ObjectId,
    roomTypeId: Types.ObjectId,
    date: Date
  ): Promise<number | null> {
    const rate = await RoomRate.findOne({
      hotelId,
      roomTypeId,
      date: {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lt: new Date(date.setHours(23, 59, 59, 999)),
      },
      isActive: true,
    });
    return rate?.inventory ?? null;
  }
}