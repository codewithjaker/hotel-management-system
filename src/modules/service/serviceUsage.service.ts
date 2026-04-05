// @ts-nocheck
import { Types, startSession } from "mongoose";
import { ServiceUsage } from "./serviceUsage.model";
import { Service } from "./service.model";
import { IServiceUsage } from "./serviceUsage.interface";
import { ApiError } from "../../utils/apiResponse";

export class ServiceUsageService {
  // Add a service charge to a stay
  static async addServiceToStay(
    stayId: Types.ObjectId,
    serviceId: Types.ObjectId,
    quantity: number,
    usedAt?: Date
  ): Promise<IServiceUsage> {
    const session = await startSession();
    session.startTransaction();
    try {
      // Verify stay exists and is active
      const { Stay } = await import("../booking/stay.model");
      const stay = await Stay.findById(stayId).session(session);
      if (!stay) throw new ApiError(404, "Stay not found");
      if (stay.status !== "active") throw new ApiError(400, "Cannot add services to a completed stay");

      // Get service details
      const service = await Service.findById(serviceId).session(session);
      if (!service) throw new ApiError(404, "Service not found");
      if (!service.isActive) throw new ApiError(400, "Service is not active");

      const totalPrice = quantity * service.price;
      const usage = await ServiceUsage.create([{
        hotelId: stay.hotelId,
        stayId: stay._id,
        serviceId: service._id,
        quantity,
        unitPrice: service.price,
        totalPrice,
        usedAt: usedAt || new Date(),
      }], { session });

      await session.commitTransaction();
      return usage[0].toJSON();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Get all service usages for a stay
  static async getUsagesByStay(stayId: Types.ObjectId): Promise<IServiceUsage[]> {
    return ServiceUsage.find({ stayId }).populate("serviceId", "name category").sort({ usedAt: 1 }).lean();
  }

  // Get all service usages with pagination
  static async getAllUsages(
    filter: Record<string, any> = {},
    page = 1,
    limit = 10
  ): Promise<{ usages: IServiceUsage[]; total: number }> {
    const skip = (page - 1) * limit;
    const [usages, total] = await Promise.all([
      ServiceUsage.find(filter)
        .skip(skip)
        .limit(limit)
        .populate("serviceId", "name category price")
        .populate("stayId", "checkInAt checkOutAt")
        .sort({ usedAt: -1 })
        .lean(),
      ServiceUsage.countDocuments(filter),
    ]);
    return { usages, total };
  }

  static async getUsageById(id: string | Types.ObjectId): Promise<IServiceUsage | null> {
    return ServiceUsage.findById(id).populate("serviceId", "name category price").lean();
  }

  static async updateUsage(
    id: string | Types.ObjectId,
    updateData: { quantity?: number; usedAt?: Date }
  ): Promise<IServiceUsage | null> {
    const usage = await ServiceUsage.findById(id);
    if (!usage) return null;
    if (updateData.quantity !== undefined) {
      usage.quantity = updateData.quantity;
      usage.totalPrice = usage.quantity * usage.unitPrice;
      await usage.save();
    }
    if (updateData.usedAt) {
      usage.usedAt = updateData.usedAt;
      await usage.save();
    }
    return usage.toJSON();
  }

  static async deleteUsage(id: string | Types.ObjectId): Promise<boolean> {
    const result = await ServiceUsage.findByIdAndDelete(id);
    return !!result;
  }

  // Remove all usages for a stay (e.g., when cancelling stay)
  static async deleteUsagesByStay(stayId: Types.ObjectId): Promise<void> {
    await ServiceUsage.deleteMany({ stayId });
  }
}