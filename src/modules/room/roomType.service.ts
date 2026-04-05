import { Types } from "mongoose";
import { RoomType } from "./roomType.model";
import { IRoomType } from "./roomType.interface";
import { ApiError } from "../../utils/apiResponse";

export class RoomTypeService {
  static async create(roomTypeData: Partial<IRoomType>): Promise<IRoomType> {
    const existing = await RoomType.findOne({
      hotelId: roomTypeData.hotelId,
      name: roomTypeData.name,
    });
    if (existing) throw new ApiError(409, "Room type with this name already exists in this hotel");
    const roomType = await RoomType.create(roomTypeData);
    return roomType.toJSON();
  }

  static async findById(id: string | Types.ObjectId): Promise<IRoomType | null> {
    return RoomType.findById(id).lean();
  }

  static async findAll(
    filter: Record<string, any> = {},
    page = 1,
    limit = 10,
    sort: Record<string, 1 | -1> = { createdAt: -1 }
  ): Promise<{ roomTypes: IRoomType[]; total: number }> {
    const skip = (page - 1) * limit;
    const [roomTypes, total] = await Promise.all([
      RoomType.find(filter).skip(skip).limit(limit).sort(sort).lean(),
      RoomType.countDocuments(filter),
    ]);
    return { roomTypes, total };
  }

  static async updateById(
    id: string | Types.ObjectId,
    updateData: Partial<IRoomType>
  ): Promise<IRoomType | null> {
    if (updateData.name) {
      const existing = await RoomType.findOne({
        hotelId: updateData.hotelId,
        name: updateData.name,
        _id: { $ne: id },
      });
      if (existing) throw new ApiError(409, "Room type name already in use");
    }
    const roomType = await RoomType.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();
    return roomType;
  }

  static async deleteById(id: string | Types.ObjectId): Promise<boolean> {
    // Check if any rooms reference this room type
    const { Room } = await import("./room.model");
    const roomsCount = await Room.countDocuments({ roomTypeId: id });
    if (roomsCount > 0) {
      throw new ApiError(400, "Cannot delete room type with existing rooms");
    }
    const result = await RoomType.findByIdAndDelete(id);
    return !!result;
  }
}