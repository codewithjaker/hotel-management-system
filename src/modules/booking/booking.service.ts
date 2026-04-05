import { Types, startSession } from "mongoose";
import { Reservation } from "./reservation.model";
import { Stay } from "./stay.model";
import { IReservation, IReservationRoom } from "./reservation.interface";
import { PricingService } from "../pricing/pricing.service";
import { ApiError } from "../../utils/apiResponse";
import { generateReservationNumber } from "./booking.utils";
import { Room } from "../room/room.model";
import { Guest } from "../guest/guest.model";

export class BookingService {
  // Check room availability for given dates
  static async checkAvailability(
    hotelId: Types.ObjectId,
    roomId: Types.ObjectId,
    checkIn: Date,
    checkOut: Date
  ): Promise<boolean> {
    const overlapping = await Reservation.findOne({
      hotelId,
      "rooms.roomId": roomId,
      status: { $in: ["pending", "confirmed", "checked-in"] },
      $or: [
        { checkInDate: { $lt: checkOut, $gte: checkIn } },
        { checkOutDate: { $gt: checkIn, $lte: checkOut } },
        { checkInDate: { $lte: checkIn }, checkOutDate: { $gte: checkOut } },
      ],
    });
    return !overlapping;
  }

  // Create reservation with atomic overlap check
  static async createReservation(data: {
    hotelId: Types.ObjectId;
    guestId: Types.ObjectId;
    checkInDate: Date;
    checkOutDate: Date;
    rooms: { roomId: string; adults: number; children: number }[];
    source?: string;
    specialRequests?: string;
  }): Promise<IReservation> {
    const session = await startSession();
    session.startTransaction();

    try {
      // Validate guest exists
      const guest = await Guest.findById(data.guestId).session(session);
      if (!guest) throw new ApiError(404, "Guest not found");

      // Validate rooms and availability
      const roomIds = data.rooms.map(r => new Types.ObjectId(r.roomId));
      const rooms = await Room.find({ _id: { $in: roomIds }, hotelId: data.hotelId }).session(session);
      if (rooms.length !== data.rooms.length) throw new ApiError(400, "One or more rooms invalid");

      // Check each room for overlap
      for (const room of data.rooms) {
        const isAvailable = await this.checkAvailability(
          data.hotelId,
          new Types.ObjectId(room.roomId),
          data.checkInDate,
          data.checkOutDate
        );
        if (!isAvailable) throw new ApiError(409, `Room ${room.roomId} not available for selected dates`);
      }

      // Calculate pricing per room
      const reservationRooms: IReservationRoom[] = [];
      let totalAmount = 0;
      for (const roomReq of data.rooms) {
        const roomDoc = rooms.find(r => r._id.toString() === roomReq.roomId);
        if (!roomDoc) throw new ApiError(404, "Room not found");
        const pricePerNight = await PricingService.calculatePrice(
          data.hotelId,
          roomDoc.roomTypeId,
          data.checkInDate,
          data.checkOutDate
        );
        const roomTotal = pricePerNight * this.getNights(data.checkInDate, data.checkOutDate);
        reservationRooms.push({
          roomId: roomDoc._id,
          pricePerNight,
          adults: roomReq.adults,
          children: roomReq.children,
        });
        totalAmount += roomTotal;
      }

      const reservationNumber = generateReservationNumber();
      const reservation = await Reservation.create([{
        hotelId: data.hotelId,
        guestId: data.guestId,
        reservationNumber,
        source: data.source || "website",
        status: "pending",
        checkInDate: data.checkInDate,
        checkOutDate: data.checkOutDate,
        rooms: reservationRooms,
        totalAmount,
        paidAmount: 0,
        specialRequests: data.specialRequests,
      }], { session });

      await session.commitTransaction();
      return reservation[0].toJSON();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async getReservationById(id: string | Types.ObjectId): Promise<any> {
    const reservation = await Reservation.findById(id)
      .populate("guestId", "firstName lastName email phone")
      .populate("rooms.roomId", "roomNumber floor roomTypeId")
      .lean();
    if (!reservation) return null;
    // Populate room types for each room (optional)
    return reservation;
  }

  static async getAllReservations(
    filter: Record<string, any> = {},
    page = 1,
    limit = 10,
    sort: Record<string, 1 | -1> = { createdAt: -1 }
  ): Promise<{ reservations: any[]; total: number }> {
    const skip = (page - 1) * limit;
    const [reservations, total] = await Promise.all([
      Reservation.find(filter)
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .populate("guestId", "firstName lastName email")
        .lean(),
      Reservation.countDocuments(filter),
    ]);
    return { reservations, total };
  }

  static async updateReservation(
    id: string | Types.ObjectId,
    updateData: Partial<IReservation>
  ): Promise<IReservation | null> {
    // Prevent status changes via this method (use dedicated methods)
    const disallowed = ["status", "reservationNumber", "totalAmount"];
    disallowed.forEach(field => delete (updateData as any)[field]);

    // If dates or rooms change, revalidate availability and recalc price
    let recalc = false;
    if (updateData.checkInDate || updateData.checkOutDate || updateData.rooms) {
      recalc = true;
    }
    if (recalc) {
      const existing = await Reservation.findById(id);
      if (!existing) throw new ApiError(404, "Reservation not found");
      const newCheckIn = updateData.checkInDate || existing.checkInDate;
      const newCheckOut = updateData.checkOutDate || existing.checkOutDate;
      const newRooms = updateData.rooms || existing.rooms;

      // Check availability for each room (excluding current reservation)
      for (const room of newRooms) {
        const overlap = await Reservation.findOne({
          _id: { $ne: id },
          hotelId: existing.hotelId,
          "rooms.roomId": room.roomId,
          status: { $in: ["pending", "confirmed", "checked-in"] },
          $or: [
            { checkInDate: { $lt: newCheckOut, $gte: newCheckIn } },
            { checkOutDate: { $gt: newCheckIn, $lte: newCheckOut } },
            { checkInDate: { $lte: newCheckIn }, checkOutDate: { $gte: newCheckOut } },
          ],
        });
        if (overlap) throw new ApiError(409, "Room not available for modified dates");
      }
      // Recalculate total amount
      let newTotal = 0;
      for (const room of newRooms) {
        const nights = this.getNights(newCheckIn, newCheckOut);
        newTotal += room.pricePerNight * nights;
      }
      updateData.totalAmount = newTotal;
    }

    const reservation = await Reservation.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).lean();
    return reservation;
  }

  static async cancelReservation(
    id: string | Types.ObjectId,
    reason?: string
  ): Promise<IReservation | null> {
    const reservation = await Reservation.findByIdAndUpdate(
      id,
      {
        status: "cancelled",
        cancelledAt: new Date(),
        cancellationReason: reason,
      },
      { new: true }
    ).lean();
    return reservation;
  }

  static async deleteReservation(id: string | Types.ObjectId): Promise<boolean> {
    // Only allow deletion of cancelled or no-show reservations
    const reservation = await Reservation.findById(id);
    if (!reservation) return false;
    if (!["cancelled", "no-show"].includes(reservation.status)) {
      throw new ApiError(400, "Cannot delete active or confirmed reservation");
    }
    const result = await Reservation.findByIdAndDelete(id);
    return !!result;
  }

  // Check-in: create Stay record and update reservation status
  static async checkIn(
    reservationId: string | Types.ObjectId,
    actualCheckInTime?: Date
  ): Promise<any> {
    const session = await startSession();
    session.startTransaction();
    try {
      const reservation = await Reservation.findById(reservationId).session(session);
      if (!reservation) throw new ApiError(404, "Reservation not found");
      if (reservation.status !== "confirmed" && reservation.status !== "pending") {
        throw new ApiError(400, `Cannot check-in reservation with status ${reservation.status}`);
      }

      const checkInTime = actualCheckInTime || new Date();
      // Create stays for each room
      const stays = [];
      for (const room of reservation.rooms) {
        const stay = await Stay.create([{
          reservationId: reservation._id,
          guestId: reservation.guestId,
          roomId: room.roomId,
          checkInAt: checkInTime,
          status: "active",
        }], { session });
        stays.push(stay[0]);
        // Update room status to occupied
        await Room.findByIdAndUpdate(room.roomId, { status: "occupied" }, { session });
      }
      // Update reservation status
      reservation.status = "checked-in";
      await reservation.save({ session });
      await session.commitTransaction();
      return { reservation, stays };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  // Check-out: close stays, update room status, calculate final bill (delegated to billing module)
  static async checkOut(
    reservationId: string | Types.ObjectId,
    actualCheckOutTime?: Date
  ): Promise<any> {
    const session = await startSession();
    session.startTransaction();
    try {
      const reservation = await Reservation.findById(reservationId).session(session);
      if (!reservation) throw new ApiError(404, "Reservation not found");
      if (reservation.status !== "checked-in") {
        throw new ApiError(400, `Reservation is not checked in (status: ${reservation.status})`);
      }

      const checkOutTime = actualCheckOutTime || new Date();
      // Update stays
      await Stay.updateMany(
        { reservationId: reservation._id, status: "active" },
        { checkOutAt: checkOutTime, status: "completed" },
        { session }
      );
      // Update room status to dirty (housekeeping)
      for (const room of reservation.rooms) {
        await Room.findByIdAndUpdate(room.roomId, { status: "available", housekeepingStatus: "dirty" }, { session });
      }
      // Update reservation status
      reservation.status = "checked-out";
      await reservation.save({ session });
      await session.commitTransaction();
      // Trigger billing invoice generation (external call)
      const { BillingService } = await import("../billing/billing.service");
      const invoice = await BillingService.generateInvoiceForReservation(reservationId);
      return { reservation, invoice };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  private static getNights(checkIn: Date, checkOut: Date): number {
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}