import { z } from "zod";

const objectId = z.string().length(24, "Invalid ID format");

export const createRateSchema = z.object({
  body: z.object({
    hotelId: objectId,
    roomTypeId: objectId,
    date: z.string().datetime(),
    price: z.number().min(0),
    inventory: z.number().min(0).nullable().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const bulkCreateRatesSchema = z.object({
  body: z.object({
    hotelId: objectId,
    roomTypeId: objectId,
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    price: z.number().min(0),
    inventory: z.number().min(0).nullable().optional(),
    overwrite: z.boolean().default(false),
  }).refine(data => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  }),
});

export const updateRateSchema = z.object({
  body: z.object({
    price: z.number().min(0).optional(),
    inventory: z.number().min(0).nullable().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const rateIdParamSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

export const rateQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    hotelId: objectId.optional(),
    roomTypeId: objectId.optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    isActive: z.string().regex(/^(true|false)$/).optional(),
  }),
});