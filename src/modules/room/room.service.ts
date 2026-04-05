import { Types } from "mongoose";
import { Room } from "./room.model";
import { IRoom } from "./room.interface";
import { ApiError } from "../../utils/apiResponse";

export class RoomService {
  static async create(roomData: Partial<IRoom>): Promise<IRoom> {
    const existing = await Room.findOne({
      hotelId: roomData.hotelId,
      roomNumber: roomData.roomNumber,
    });
    if (existing) throw new ApiError(409, "Room number already exists in this hotel");
    const room = await Room.create(roomData);
    return room.toJSON();
  }

  static async findById(id: string | Types.ObjectId): Promise<IRoom | null> {
    return Room.findById(id).populate("roomTypeId").lean();
  }

  static async findAll(
    filter: Record<string, any> = {},
    page = 1,
    limit = 10,
    sort: Record<string, 1 | -1> = { createdAt: -1 }
  ): Promise<{ rooms: IRoom[]; total: number }> {
    const skip = (page - 1) * limit;
    const [rooms, total] = await Promise.all([
      Room.find(filter).skip(skip).limit(limit).sort(sort).populate("roomTypeId").lean(),
      Room.countDocuments(filter),
    ]);
    return { rooms, total };
  }

  static async updateById(
    id: string | Types.ObjectId,
    updateData: Partial<IRoom>
  ): Promise<IRoom | null> {
    if (updateData.roomNumber) {
      const existing = await Room.findOne({
        hotelId: updateData.hotelId,
        roomNumber: updateData.roomNumber,
        _id: { $ne: id },
      });
      if (existing) throw new ApiError(409, "Room number already in use");
    }
    const room = await Room.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("roomTypeId").lean();
    return room;
  }

  static async deleteById(id: string | Types.ObjectId): Promise<boolean> {
    // Check if room has active stays or future reservations
    const { Stay } = await import("../booking/stay.model");
    const { Reservation } = await import("../booking/reservation.model");
    const activeStay = await Stay.findOne({ roomId: id, status: "active" });
    if (activeStay) throw new ApiError(400, "Cannot delete room with active stay");
    const futureReservation = await Reservation.findOne({
      "rooms.roomId": id,
      checkInDate: { $gte: new Date() },
      status: { $in: ["pending", "confirmed"] },
    });
    if (futureReservation) throw new ApiError(400, "Cannot delete room with future reservations");
    const result = await Room.findByIdAndDelete(id);
    return !!result;
  }

  static async updateStatus(id: string | Types.ObjectId, status: IRoom["status"]) {
    const room = await Room.findByIdAndUpdate(id, { status }, { new: true }).lean();
    return room;
  }

  static async updateHousekeepingStatus(id: string | Types.ObjectId, housekeepingStatus: IRoom["housekeepingStatus"]) {
    const room = await Room.findByIdAndUpdate(id, { housekeepingStatus }, { new: true }).lean();
    return room;
  }
}