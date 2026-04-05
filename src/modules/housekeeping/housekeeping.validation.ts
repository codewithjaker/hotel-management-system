import { z } from "zod";

const objectId = z.string().length(24, "Invalid ID format");

export const createTaskSchema = z.object({
  body: z.object({
    hotelId: objectId,
    roomId: objectId,
    assignedTo: objectId.optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    notes: z.string().optional(),
    scheduledAt: z.string().datetime().optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    assignedTo: objectId.optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    notes: z.string().optional(),
    scheduledAt: z.string().datetime().optional(),
  }),
});

export const taskIdParamSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

export const taskQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    hotelId: objectId.optional(),
    roomId: objectId.optional(),
    status: z.enum(["pending", "in_progress", "completed", "inspected"]).optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    assignedTo: objectId.optional(),
  }),
});

export const completeTaskSchema = z.object({
  body: z.object({
    notes: z.string().optional(),
  }),
});

export const inspectTaskSchema = z.object({
  body: z.object({
    passed: z.boolean(),
    notes: z.string().optional(),
  }),
});