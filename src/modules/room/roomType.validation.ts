import { z } from "zod";

export const createRoomTypeSchema = z.object({
  body: z.object({
    hotelId: z.string().length(24, "Invalid hotel ID"),
    name: z.string().min(1, "Name required"),
    description: z.string().optional(),
    capacityAdults: z.number().min(1).default(2),
    capacityChildren: z.number().min(0).default(0),
    basePrice: z.number().min(0),
    bedType: z.string().optional(),
    amenities: z.array(z.string()).optional(),
    isActive: z.boolean().default(true),
  }),
});

export const updateRoomTypeSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    capacityAdults: z.number().min(1).optional(),
    capacityChildren: z.number().min(0).optional(),
    basePrice: z.number().min(0).optional(),
    bedType: z.string().optional(),
    amenities: z.array(z.string()).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const roomTypeIdParamSchema = z.object({
  params: z.object({
    id: z.string().length(24, "Invalid room type ID"),
  }),
});

export const roomTypeQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    hotelId: z.string().length(24).optional(),
    isActive: z.string().regex(/^(true|false)$/).optional(),
  }),
});