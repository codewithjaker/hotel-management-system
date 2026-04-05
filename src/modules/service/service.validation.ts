import { z } from "zod";

const objectId = z.string().length(24, "Invalid ID format");

export const createServiceSchema = z.object({
  body: z.object({
    hotelId: objectId,
    name: z.string().min(1),
    category: z.enum(["spa", "food", "laundry", "transport", "other"]),
    price: z.number().min(0),
    isActive: z.boolean().optional(),
  }),
});

export const updateServiceSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    category: z.enum(["spa", "food", "laundry", "transport", "other"]).optional(),
    price: z.number().min(0).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const serviceIdParamSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

export const serviceQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    hotelId: objectId.optional(),
    category: z.enum(["spa", "food", "laundry", "transport", "other"]).optional(),
    isActive: z.string().regex(/^(true|false)$/).optional(),
  }),
});

export const createServiceUsageSchema = z.object({
  body: z.object({
    stayId: objectId,
    serviceId: objectId,
    quantity: z.number().int().min(1).default(1),
    usedAt: z.string().datetime().optional(),
  }),
});

export const updateServiceUsageSchema = z.object({
  body: z.object({
    quantity: z.number().int().min(1).optional(),
    usedAt: z.string().datetime().optional(),
  }),
});

export const stayIdParamSchema = z.object({
  params: z.object({
    stayId: objectId,
  }),
});

export const serviceUsageIdParamSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

export const serviceUsageQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    stayId: objectId.optional(),
    serviceId: objectId.optional(),
    hotelId: objectId.optional(),
  }),
});