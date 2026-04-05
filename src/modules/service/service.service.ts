import { Types } from "mongoose";
import { Service } from "./service.model";
import { IService } from "./service.interface";
import { ApiError } from "../../utils/apiResponse";

export class ServiceService {
  static async create(serviceData: Partial<IService>): Promise<IService> {
    const existing = await Service.findOne({
      hotelId: serviceData.hotelId,
      name: serviceData.name,
    });
    if (existing) throw new ApiError(409, "Service with this name already exists in this hotel");
    const service = await Service.create(serviceData);
    return service.toJSON();
  }

  static async findById(id: string | Types.ObjectId): Promise<IService | null> {
    return Service.findById(id).lean();
  }

  static async findAll(
    filter: Record<string, any> = {},
    page = 1,
    limit = 10,
    sort: Record<string, 1 | -1> = { createdAt: -1 }
  ): Promise<{ services: IService[]; total: number }> {
    const skip = (page - 1) * limit;
    const [services, total] = await Promise.all([
      Service.find(filter).skip(skip).limit(limit).sort(sort).lean(),
      Service.countDocuments(filter),
    ]);
    return { services, total };
  }

  static async updateById(
    id: string | Types.ObjectId,
    updateData: Partial<IService>
  ): Promise<IService | null> {
    if (updateData.name) {
      const existing = await Service.findOne({
        hotelId: updateData.hotelId,
        name: updateData.name,
        _id: { $ne: id },
      });
      if (existing) throw new ApiError(409, "Service name already in use");
    }
    const service = await Service.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();
    return service;
  }

  static async deleteById(id: string | Types.ObjectId): Promise<boolean> {
    // Check if any service usage exists for this service
    const { ServiceUsage } = await import("./serviceUsage.model");
    const usageCount = await ServiceUsage.countDocuments({ serviceId: id });
    if (usageCount > 0) {
      throw new ApiError(400, "Cannot delete service with existing usage records");
    }
    const result = await Service.findByIdAndDelete(id);
    return !!result;
  }
}