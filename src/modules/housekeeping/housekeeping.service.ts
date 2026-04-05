import { Types, startSession } from "mongoose";
import { Housekeeping } from "./housekeeping.model";
import { IHousekeeping } from "./housekeeping.interface";
import { ApiError } from "../../utils/apiResponse";

export class HousekeepingService {
  static async createTask(taskData: Partial<IHousekeeping>): Promise<IHousekeeping> {
    // Check if room already has pending/in_progress task
    const existing = await Housekeeping.findOne({
      roomId: taskData.roomId,
      status: { $in: ["pending", "in_progress"] },
    });
    if (existing) throw new ApiError(409, "Room already has a pending or in-progress cleaning task");
    const task = await Housekeeping.create(taskData);
    return task.toJSON();
  }

  static async getTaskById(id: string | Types.ObjectId): Promise<IHousekeeping | null> {
    return Housekeeping.findById(id)
      .populate("roomId", "roomNumber floor status")
      .populate("assignedTo", "firstName lastName email")
      .populate("inspectedBy", "firstName lastName")
      .lean();
  }

  static async getAllTasks(
    filter: Record<string, any> = {},
    page = 1,
    limit = 10,
    sort: Record<string, 1 | -1> = { priority: -1, scheduledAt: 1 }
  ): Promise<{ tasks: IHousekeeping[]; total: number }> {
    const skip = (page - 1) * limit;
    const [tasks, total] = await Promise.all([
      Housekeeping.find(filter)
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .populate("roomId", "roomNumber floor")
        .populate("assignedTo", "firstName lastName")
        .lean(),
      Housekeeping.countDocuments(filter),
    ]);
    return { tasks, total };
  }

  static async updateTask(
    id: string | Types.ObjectId,
    updateData: Partial<IHousekeeping>
  ): Promise<IHousekeeping | null> {
    // Prevent changing hotelId or roomId after creation
    delete (updateData as any).hotelId;
    delete (updateData as any).roomId;
    const task = await Housekeeping.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();
    return task;
  }

  static async deleteTask(id: string | Types.ObjectId): Promise<boolean> {
    const result = await Housekeeping.findByIdAndDelete(id);
    return !!result;
  }

  // Start a task
  static async startTask(id: string | Types.ObjectId, startedBy: Types.ObjectId): Promise<IHousekeeping | null> {
    const task = await Housekeeping.findById(id);
    if (!task) throw new ApiError(404, "Task not found");
    if (task.status !== "pending") throw new ApiError(400, `Task cannot be started (status: ${task.status})`);
    task.status = "in_progress";
    task.startedAt = new Date();
    task.assignedTo = startedBy;
    await task.save();
    return task.toJSON();
  }

  // Complete a task and update room housekeeping status
  static async completeTask(
    id: string | Types.ObjectId,
    notes?: string
  ): Promise<{ task: IHousekeeping; roomUpdated: boolean }> {
    const session = await startSession();
    session.startTransaction();
    try {
      const task = await Housekeeping.findById(id).session(session);
      if (!task) throw new ApiError(404, "Task not found");
      if (task.status !== "in_progress") throw new ApiError(400, `Task cannot be completed (status: ${task.status})`);
      task.status = "completed";
      task.completedAt = new Date();
      if (notes) task.notes = notes;
      await task.save({ session });

      // Update room housekeeping status to "clean"
      const { Room } = await import("../room/room.model");
      await Room.findByIdAndUpdate(task.roomId, { housekeepingStatus: "clean" }, { session });

      await session.commitTransaction();
      return { task: task.toJSON(), roomUpdated: true };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Inspect a completed task
  static async inspectTask(
    id: string | Types.ObjectId,
    inspectedBy: Types.ObjectId,
    passed: boolean,
    notes?: string
  ): Promise<IHousekeeping | null> {
    const task = await Housekeeping.findById(id);
    if (!task) throw new ApiError(404, "Task not found");
    if (task.status !== "completed") throw new ApiError(400, "Only completed tasks can be inspected");
    if (passed) {
      task.status = "inspected";
    } else {
      // Reopen task if inspection fails
      task.status = "pending";
      task.notes = notes || "Inspection failed, needs rework";
    }
    task.inspectedAt = new Date();
    task.inspectedBy = inspectedBy;
    await task.save();
    return task.toJSON();
  }

  // Auto-create housekeeping task when room becomes dirty (e.g., after check-out)
  static async autoCreateForRoom(roomId: Types.ObjectId, hotelId: Types.ObjectId, priority: "high" | "medium" | "low" = "high"): Promise<IHousekeeping> {
    const existing = await Housekeeping.findOne({
      roomId,
      status: { $in: ["pending", "in_progress"] },
    });
    if (existing) return existing.toJSON(); // already has task
    const task = await Housekeeping.create({
      hotelId,
      roomId,
      priority,
      status: "pending",
      notes: "Auto-generated from check-out",
    });
    return task.toJSON();
  }
}