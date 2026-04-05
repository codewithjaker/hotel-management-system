import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const createHotelSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Hotel name required"),
    brand: z.string().optional(),
    email: z.string().email("Invalid email").optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
    timezone: z.string().default("UTC"),
    currency: z.string().length(3, "Currency must be 3-letter code").default("USD"),
    taxRate: z.number().min(0).max(100).default(0),
    website: z.string().url("Invalid URL").optional(),
    checkInTime: z.string().regex(timeRegex, "Invalid time format (HH:MM)").default("14:00"),
    checkOutTime: z.string().regex(timeRegex, "Invalid time format (HH:MM)").default("11:00"),
    status: z.enum(["active", "inactive"]).default("active"),
  }),
});

export const updateHotelSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    brand: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
    timezone: z.string().optional(),
    currency: z.string().length(3).optional(),
    taxRate: z.number().min(0).max(100).optional(),
    website: z.string().url().optional(),
    checkInTime: z.string().regex(timeRegex).optional(),
    checkOutTime: z.string().regex(timeRegex).optional(),
    status: z.enum(["active", "inactive"]).optional(),
  }),
});

export const hotelIdParamSchema = z.object({
  params: z.object({
    id: z.string().length(24, "Invalid hotel ID"),
  }),
});

export const hotelQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    status: z.enum(["active", "inactive"]).optional(),
    country: z.string().optional(),
    city: z.string().optional(),
  }),
});