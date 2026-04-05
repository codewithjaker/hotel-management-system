import { Types } from "mongoose";
import { Reservation } from "../booking/reservation.model";
import { Stay } from "../booking/stay.model";
import { Invoice } from "../billing/invoice.model";
import { Payment } from "../billing/payment.model";
import { ServiceUsage } from "../service/serviceUsage.model";
import { Room } from "../room/room.model";
import { Maintenance } from "../maintenance/maintenance.model";
import { IAnalyticsFilter, IOccupancyReport, IRevenueReport, IKpiDashboard } from "./analytics.interface";
import { ApiError } from "../../utils/apiResponse";

export class AnalyticsService {
  // Helper to get date range aggregation
  private static getDateGrouping(groupBy: string, dateField: string) {
    switch (groupBy) {
      case "day":
        return { $dateToString: { format: "%Y-%m-%d", date: `$${dateField}` } };
      case "week":
        return { $week: `$${dateField}` };
      case "month":
        return { $month: `$${dateField}` };
      case "year":
        return { $year: `$${dateField}` };
      default:
        return { $dateToString: { format: "%Y-%m-%d", date: `$${dateField}` } };
    }
  }

  // Occupancy Report
  static async getOccupancyReport(filter: IAnalyticsFilter): Promise<IOccupancyReport[]> {
    const { hotelId, startDate, endDate, groupBy = "day" } = filter;
    const matchStage: any = {
      hotelId: hotelId ? new Types.ObjectId(hotelId) : { $exists: true },
      status: { $in: ["checked-in", "checked-out", "confirmed"] },
      checkInDate: { $gte: startDate, $lte: endDate },
    };
    const groupId = this.getDateGrouping(groupBy, "checkInDate");
    const occupancyAgg = await Reservation.aggregate([
      { $match: matchStage },
      { $group: { _id: groupId, occupiedRooms: { $sum: { $size: "$rooms" } } } },
      { $sort: { _id: 1 } },
    ]);
    // Get total rooms per hotel
    const totalRooms = await Room.countDocuments(hotelId ? { hotelId } : {});
    const maintenanceRooms = await Room.countDocuments({
      ...(hotelId ? { hotelId } : {}),
      status: "maintenance",
    });
    const result: IOccupancyReport[] = [];
    let current = new Date(startDate);
    while (current <= endDate) {
      const dateStr = current.toISOString().split("T")[0];
      const occupied = occupancyAgg.find(o => o._id === dateStr)?.occupiedRooms || 0;
      result.push({
        date: dateStr,
        totalRooms,
        occupiedRooms: occupied,
        availableRooms: totalRooms - occupied - maintenanceRooms,
        maintenanceRooms,
        occupancyRate: totalRooms ? (occupied / totalRooms) * 100 : 0,
      });
      current.setDate(current.getDate() + 1);
    }
    return result;
  }

  // Revenue Report
  static async getRevenueReport(filter: IAnalyticsFilter): Promise<IRevenueReport[]> {
    const { hotelId, startDate, endDate, groupBy = "day" } = filter;
    const matchStage: any = {
      createdAt: { $gte: startDate, $lte: endDate },
      status: { $in: ["paid", "partial"] },
    };
    if (hotelId) {
      // Invoice doesn't have hotelId directly; need to join via reservation
      const reservations = await Reservation.find({ hotelId }).select("_id");
      const reservationIds = reservations.map(r => r._id);
      matchStage.reservationId = { $in: reservationIds };
    }
    const groupId = this.getDateGrouping(groupBy, "createdAt");
    const revenueAgg = await Invoice.aggregate([
      { $match: matchStage },
      { $group: { _id: groupId, totalRevenue: { $sum: "$totalAmount" }, taxCollected: { $sum: "$taxAmount" }, discountGiven: { $sum: "$discountAmount" } } },
      { $sort: { _id: 1 } },
    ]);
    // Service revenue separately
    const serviceMatch: any = { usedAt: { $gte: startDate, $lte: endDate } };
    if (hotelId) serviceMatch.hotelId = new Types.ObjectId(hotelId);
    const serviceAgg = await ServiceUsage.aggregate([
      { $match: serviceMatch },
      { $group: { _id: this.getDateGrouping(groupBy, "usedAt"), serviceRevenue: { $sum: "$totalPrice" } } },
    ]);
    // Combine
    const result: IRevenueReport[] = [];
    let current = new Date(startDate);
    while (current <= endDate) {
      const dateStr = current.toISOString().split("T")[0];
      const rev = revenueAgg.find(r => r._id === dateStr) || { totalRevenue: 0, taxCollected: 0, discountGiven: 0 };
      const servRev = serviceAgg.find(s => s._id === dateStr)?.serviceRevenue || 0;
      result.push({
        date: dateStr,
        roomRevenue: rev.totalRevenue - servRev,
        serviceRevenue: servRev,
        totalRevenue: rev.totalRevenue,
        taxCollected: rev.taxCollected,
        discountGiven: rev.discountGiven,
      });
      current.setDate(current.getDate() + 1);
    }
    return result;
  }

  // KPI Dashboard
  static async getKpiDashboard(hotelId?: Types.ObjectId): Promise<IKpiDashboard> {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    // Revenue this month
    const revenueResult = await this.getRevenueReport({
      hotelId,
      startDate: startOfMonth,
      endDate: endOfMonth,
    });
    const totalRevenue = revenueResult.reduce((sum, d) => sum + d.totalRevenue, 0);
    // Occupancy this month
    const occupancyResult = await this.getOccupancyReport({
      hotelId,
      startDate: startOfMonth,
      endDate: endOfMonth,
    });
    const avgOccupancy = occupancyResult.reduce((sum, d) => sum + d.occupancyRate, 0) / (occupancyResult.length || 1);
    const totalRooms = occupancyResult[0]?.totalRooms || 0;
    const totalRoomNights = occupancyResult.reduce((sum, d) => sum + d.occupiedRooms, 0);
    const adr = totalRoomNights ? revenueResult.reduce((sum, d) => sum + d.roomRevenue, 0) / totalRoomNights : 0;
    const revPAR = adr * (avgOccupancy / 100);
    // Booking stats
    const bookingMatch: any = { createdAt: { $gte: startOfMonth, $lte: endOfMonth } };
    if (hotelId) bookingMatch.hotelId = new Types.ObjectId(hotelId);
    const totalBookings = await Reservation.countDocuments(bookingMatch);
    const cancelledBookings = await Reservation.countDocuments({ ...bookingMatch, status: "cancelled" });
    const cancellationRate = totalBookings ? (cancelledBookings / totalBookings) * 100 : 0;
    // Average lead time (days between creation and check-in)
    const leadTimeAgg = await Reservation.aggregate([
      { $match: { ...bookingMatch, checkInDate: { $exists: true } } },
      { $project: { leadTime: { $divide: [{ $subtract: ["$checkInDate", "$createdAt"] }, 86400000] } } },
      { $group: { _id: null, avgLeadTime: { $avg: "$leadTime" } } },
    ]);
    const averageLeadTime = leadTimeAgg[0]?.avgLeadTime || 0;
    // Top 5 services by revenue
    const topServicesAgg = await ServiceUsage.aggregate([
      { $match: { usedAt: { $gte: startOfMonth, $lte: endOfMonth }, ...(hotelId ? { hotelId: new Types.ObjectId(hotelId) } : {}) } },
      { $group: { _id: "$serviceId", revenue: { $sum: "$totalPrice" } } },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      { $lookup: { from: "services", localField: "_id", foreignField: "_id", as: "service" } },
      { $unwind: "$service" },
      { $project: { name: "$service.name", revenue: 1 } },
    ]);
    // Upcoming check-ins (next 7 days)
    const upcomingCheckIns = await Reservation.countDocuments({
      ...(hotelId ? { hotelId: new Types.ObjectId(hotelId) } : {}),
      checkInDate: { $gte: today, $lte: new Date(today.getTime() + 7 * 86400000) },
      status: "confirmed",
    });
    // Pending maintenance issues
    const pendingMaintenance = await Maintenance.countDocuments({
      ...(hotelId ? { hotelId: new Types.ObjectId(hotelId) } : {}),
      status: { $in: ["reported", "in_progress"] },
    });
    return {
      totalRevenue,
      averageDailyRate: adr,
      occupancyRate: avgOccupancy,
      revPAR,
      adr,
      totalBookings,
      cancellationRate,
      averageLeadTime,
      topServices: topServicesAgg.map(s => ({ name: s.name, revenue: s.revenue })),
      upcomingCheckIns,
      pendingMaintenance,
    };
  }
}