import { Types, startSession } from "mongoose";
import { Maintenance } from "./maintenance.model";
import { IMaintenance } from "./maintenance.interface";
import { ApiError } from "../../utils/apiResponse";
import { Room } from "../room/room.model";

export class MaintenanceService {
  static async createIssue(issueData: Partial<IMaintenance>): Promise<IMaintenance> {
    const session = await startSession();
    session.startTransaction();
    try {
      const issue = await Maintenance.create([issueData], { session });
      // If roomId is provided, set room status to "maintenance"
      if (issueData.roomId) {
        await Room.findByIdAndUpdate(issueData.roomId, { status: "maintenance" }, { session });
      }
      await session.commitTransaction();
      return issue[0].toJSON();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async getIssueById(id: string | Types.ObjectId): Promise<IMaintenance | null> {
    return Maintenance.findById(id)
      .populate("roomId", "roomNumber floor status")
      .populate("reportedBy", "firstName lastName email")
      .populate("assignedTo", "firstName lastName email")
      .lean();
  }

  static async getAllIssues(
    filter: Record<string, any> = {},
    page = 1,
    limit = 10,
    sort: Record<string, 1 | -1> = { priority: -1, reportedAt: -1 }
  ): Promise<{ issues: IMaintenance[]; total: number }> {
    const skip = (page - 1) * limit;
    const [issues, total] = await Promise.all([
      Maintenance.find(filter)
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .populate("roomId", "roomNumber")
        .populate("assignedTo", "firstName lastName")
        .lean(),
      Maintenance.countDocuments(filter),
    ]);
    return { issues, total };
  }

  static async updateIssue(
    id: string | Types.ObjectId,
    updateData: Partial<IMaintenance>
  ): Promise<IMaintenance | null> {
    delete (updateData as any).hotelId;
    const issue = await Maintenance.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();
    return issue;
  }

  static async deleteIssue(id: string | Types.ObjectId): Promise<boolean> {
    const issue = await Maintenance.findById(id);
    if (!issue) return false;
    // Optionally, if room was set to maintenance and this is the only active issue, revert room status
    if (issue.roomId && issue.status !== "closed") {
      const otherActive = await Maintenance.findOne({
        roomId: issue.roomId,
        _id: { $ne: id },
        status: { $in: ["reported", "in_progress", "resolved"] },
      });
      if (!otherActive) {
        await Room.findByIdAndUpdate(issue.roomId, { status: "available" });
      }
    }
    const result = await Maintenance.findByIdAndDelete(id);
    return !!result;
  }

  static async assignIssue(id: string | Types.ObjectId, assignedTo: Types.ObjectId): Promise<IMaintenance | null> {
    const issue = await Maintenance.findByIdAndUpdate(
      id,
      { assignedTo, status: "in_progress" },
      { new: true }
    ).lean();
    return issue;
  }

  static async resolveIssue(id: string | Types.ObjectId, cost?: number, notes?: string): Promise<IMaintenance | null> {
    const issue = await Maintenance.findByIdAndUpdate(
      id,
      {
        status: "resolved",
        resolvedAt: new Date(),
        cost,
        notes,
      },
      { new: true }
    ).lean();
    return issue;
  }

  static async closeIssue(id: string | Types.ObjectId): Promise<IMaintenance | null> {
    const session = await startSession();
    session.startTransaction();
    try {
      const issue = await Maintenance.findByIdAndUpdate(
        id,
        { status: "closed", closedAt: new Date() },
        { new: true, session }
      );
      if (issue && issue.roomId) {
        // Check if any other unresolved issues for this room
        const otherActive = await Maintenance.findOne({
          roomId: issue.roomId,
          _id: { $ne: id },
          status: { $in: ["reported", "in_progress", "resolved"] },
        }).session(session);
        if (!otherActive) {
          await Room.findByIdAndUpdate(issue.roomId, { status: "available" }, { session });
        }
      }
      await session.commitTransaction();
      return issue?.toJSON() || null;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}