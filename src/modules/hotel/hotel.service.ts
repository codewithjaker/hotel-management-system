import { Types } from "mongoose";
import { Hotel } from "./hotel.model";
import { IHotel } from "./hotel.interface";
import { ApiError } from "../../utils/apiResponse";

export class HotelService {
  static async create(hotelData: Partial<IHotel>): Promise<IHotel> {
    // Check duplicate name
    const existing = await Hotel.findOne({ name: hotelData.name });
    if (existing) throw new ApiError(409, "Hotel with this name already exists");
    const hotel = await Hotel.create(hotelData);
    return hotel.toJSON();
  }

  static async findById(id: string | Types.ObjectId): Promise<IHotel | null> {
    return Hotel.findById(id).lean();
  }

  static async findAll(
    filter: Record<string, any> = {},
    page = 1,
    limit = 10,
    sort: Record<string, 1 | -1> = { createdAt: -1 }
  ): Promise<{ hotels: IHotel[]; total: number }> {
    const skip = (page - 1) * limit;
    const [hotels, total] = await Promise.all([
      Hotel.find(filter).skip(skip).limit(limit).sort(sort).lean(),
      Hotel.countDocuments(filter),
    ]);
    return { hotels, total };
  }

  static async updateById(
    id: string | Types.ObjectId,
    updateData: Partial<IHotel>
  ): Promise<IHotel | null> {
    // If updating name, check uniqueness
    if (updateData.name) {
      const existing = await Hotel.findOne({ name: updateData.name, _id: { $ne: id } });
      if (existing) throw new ApiError(409, "Hotel name already in use");
    }
    const hotel = await Hotel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();
    return hotel;
  }

  static async deleteById(id: string | Types.ObjectId): Promise<boolean> {
    // Optional: check if any dependent records (users, rooms, reservations) exist before deletion
    // For now, soft delete is recommended. But we'll implement hard delete with check.
    const User = (await import("../user/user.model")).User;
    const Room = (await import("../room/room.model")).Room;
    const Reservation = (await import("../booking/reservation.model")).Reservation;

    const [users, rooms, reservations] = await Promise.all([
      User.countDocuments({ hotelId: id }),
      Room.countDocuments({ hotelId: id }),
      Reservation.countDocuments({ hotelId: id }),
    ]);

    if (users > 0 || rooms > 0 || reservations > 0) {
      throw new ApiError(400, "Cannot delete hotel with existing users, rooms, or reservations");
    }

    const result = await Hotel.findByIdAndDelete(id);
    return !!result;
  }
}