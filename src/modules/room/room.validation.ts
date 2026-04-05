import { z } from "zod";

export const createRoomSchema = z.object({
  body: z.object({
    hotelId: z.string().length(24, "Invalid hotel ID"),
    roomTypeId: z.string().length(24, "Invalid room type ID"),
    roomNumber: z.string().min(1, "Room number required"),
    floor: z.number().optional(),
    status: z.enum(["available", "occupied", "maintenance", "cleaning"]).optional(),
    housekeepingStatus: z.enum(["clean", "dirty", "inspected"]).optional(),
    notes: z.string().optional(),
  }),
});

export const updateRoomSchema = z.object({
  body: z.object({
    roomNumber: z.string().min(1).optional(),
    floor: z.number().optional(),
    status: z.enum(["available", "occupied", "maintenance", "cleaning"]).optional(),
    housekeepingStatus: z.enum(["clean", "dirty", "inspected"]).optional(),
    notes: z.string().optional(),
  }),
});

export const roomIdParamSchema = z.object({
  params: z.object({
    id: z.string().length(24, "Invalid room ID"),
  }),
});

export const roomQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    hotelId: z.string().length(24).optional(),
    roomTypeId: z.string().length(24).optional(),
    status: z.enum(["available", "occupied", "maintenance", "cleaning"]).optional(),
    housekeepingStatus: z.enum(["clean", "dirty", "inspected"]).optional(),
  }),
});

export const updateRoomStatusSchema = z.object({
  body: z.object({
    status: z.enum(["available", "occupied", "maintenance", "cleaning"]),
  }),
});

export const updateHousekeepingSchema = z.object({
  body: z.object({
    housekeepingStatus: z.enum(["clean", "dirty", "inspected"]),
  }),
});