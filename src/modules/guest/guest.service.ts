import { Types } from "mongoose";
import { Guest } from "./guest.model";
import { IGuest } from "./guest.interface";
import { ApiError } from "../../utils/apiResponse";

export class GuestService {
  static async create(guestData: Partial<IGuest>): Promise<IGuest> {
    // Check duplicate by email or phone
    if (guestData.email) {
      const existing = await Guest.findOne({ email: guestData.email });
      if (existing) throw new ApiError(409, "Guest with this email already exists");
    }
    if (guestData.phone) {
      const existing = await Guest.findOne({ phone: guestData.phone });
      if (existing) throw new ApiError(409, "Guest with this phone number already exists");
    }
    const guest = await Guest.create(guestData);
    return guest.toJSON();
  }

  static async findById(id: string | Types.ObjectId): Promise<IGuest | null> {
    return Guest.findById(id).lean();
  }

  static async findAll(
    filter: Record<string, any> = {},
    page = 1,
    limit = 10,
    sort: Record<string, 1 | -1> = { createdAt: -1 }
  ): Promise<{ guests: IGuest[]; total: number }> {
    const skip = (page - 1) * limit;
    const [guests, total] = await Promise.all([
      Guest.find(filter).skip(skip).limit(limit).sort(sort).lean(),
      Guest.countDocuments(filter),
    ]);
    return { guests, total };
  }

  static async search(query: string, page = 1, limit = 10): Promise<{ guests: IGuest[]; total: number }> {
    const searchRegex = new RegExp(query, "i");
    const filter = {
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { idNumber: searchRegex },
      ],
    };
    const skip = (page - 1) * limit;
    const [guests, total] = await Promise.all([
      Guest.find(filter).skip(skip).limit(limit).lean(),
      Guest.countDocuments(filter),
    ]);
    return { guests, total };
  }

  static async updateById(
    id: string | Types.ObjectId,
    updateData: Partial<IGuest>
  ): Promise<IGuest | null> {
    // If updating email/phone, check uniqueness
    if (updateData.email) {
      const existing = await Guest.findOne({ email: updateData.email, _id: { $ne: id } });
      if (existing) throw new ApiError(409, "Email already in use by another guest");
    }
    if (updateData.phone) {
      const existing = await Guest.findOne({ phone: updateData.phone, _id: { $ne: id } });
      if (existing) throw new ApiError(409, "Phone number already in use by another guest");
    }
    const guest = await Guest.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();
    return guest;
  }

  static async deleteById(id: string | Types.ObjectId): Promise<boolean> {
    // Optional: check if guest has future reservations before deletion
    // For now, hard delete. Consider soft delete plugin.
    const result = await Guest.findByIdAndDelete(id);
    return !!result;
  }

  static async getGuestWithBookings(id: string | Types.ObjectId) {
    const guest = await Guest.findById(id).lean();
    if (!guest) return null;
    // Import Reservation model dynamically to avoid circular dependency
    const { Reservation } = await import("../booking/reservation.model");
    const bookings = await Reservation.find({ guestId: id }).sort({ checkInDate: -1 }).lean();
    return { ...guest, bookings };
  }
}