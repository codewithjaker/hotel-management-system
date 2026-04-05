import { Types } from "mongoose";

export interface IAnalyticsFilter {
  hotelId?: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  groupBy?: "day" | "week" | "month" | "year";
}

export interface IOccupancyReport {
  date: string;
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  maintenanceRooms: number;
  occupancyRate: number;
}

export interface IRevenueReport {
  date: string;
  roomRevenue: number;
  serviceRevenue: number;
  totalRevenue: number;
  taxCollected: number;
  discountGiven: number;
}

export interface IKpiDashboard {
  totalRevenue: number;
  averageDailyRate: number;
  occupancyRate: number;
  revPAR: number;
  adr: number;
  totalBookings: number;
  cancellationRate: number;
  averageLeadTime: number;
  topServices: Array<{ name: string; revenue: number }>;
  upcomingCheckIns: number;
  pendingMaintenance: number;
}