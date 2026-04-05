import { z } from "zod";

const objectId = z.string().length(24, "Invalid ID format");

export const createReservationSchema = z.object({
  body: z.object({
    hotelId: objectId,
    guestId: objectId,
    checkInDate: z.string().datetime(),
    checkOutDate: z.string().datetime(),
    rooms: z.array(z.object({
      roomId: objectId,
      adults: z.number().int().min(1),
      children: z.number().int().min(0),
    })),
    source: z.enum(["website", "ota", "walkin", "phone"]).optional(),
    specialRequests: z.string().optional(),
  }).refine(data => new Date(data.checkOutDate) > new Date(data.checkInDate), {
    message: "Check-out must be after check-in",
    path: ["checkOutDate"],
  }),
});

export const updateReservationSchema = z.object({
  body: z.object({
    checkInDate: z.string().datetime().optional(),
    checkOutDate: z.string().datetime().optional(),
    rooms: z.array(z.object({
      roomId: objectId,
      pricePerNight: z.number().min(0),
      adults: z.number().int().min(1),
      children: z.number().int().min(0),
    })).optional(),
    specialRequests: z.string().optional(),
  }).refine(data => !data.checkInDate || !data.checkOutDate || new Date(data.checkOutDate) > new Date(data.checkInDate), {
    message: "Check-out must be after check-in",
    path: ["checkOutDate"],
  }),
});

export const reservationIdParamSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

export const reservationQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    hotelId: objectId.optional(),
    guestId: objectId.optional(),
    status: z.enum(["pending", "confirmed", "cancelled", "no-show", "checked-in", "checked-out"]).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
  }),
});

export const cancelReservationSchema = z.object({
  body: z.object({
    reason: z.string().optional(),
  }),
});

export const checkInOutSchema = z.object({
  body: z.object({
    actualCheckInTime: z.string().datetime().optional(),
    actualCheckOutTime: z.string().datetime().optional(),
  }),
});