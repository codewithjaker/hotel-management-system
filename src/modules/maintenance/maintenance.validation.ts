import { z } from "zod";

const objectId = z.string().length(24, "Invalid ID format");

export const createIssueSchema = z.object({
  body: z.object({
    hotelId: objectId,
    roomId: objectId.optional(),
    issueType: z.enum(["electrical", "plumbing", "furniture", "ac", "other"]),
    description: z.string().min(1),
    priority: z.enum(["low", "medium", "high", "critical"]).optional(),
    notes: z.string().optional(),
  }),
});

export const updateIssueSchema = z.object({
  body: z.object({
    issueType: z.enum(["electrical", "plumbing", "furniture", "ac", "other"]).optional(),
    description: z.string().min(1).optional(),
    priority: z.enum(["low", "medium", "high", "critical"]).optional(),
    notes: z.string().optional(),
  }),
});

export const issueIdParamSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

export const issueQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    hotelId: objectId.optional(),
    roomId: objectId.optional(),
    status: z.enum(["reported", "in_progress", "resolved", "closed"]).optional(),
    priority: z.enum(["low", "medium", "high", "critical"]).optional(),
    issueType: z.enum(["electrical", "plumbing", "furniture", "ac", "other"]).optional(),
    assignedTo: objectId.optional(),
  }),
});

export const assignIssueSchema = z.object({
  body: z.object({
    assignedTo: objectId,
  }),
});

export const resolveIssueSchema = z.object({
  body: z.object({
    cost: z.number().min(0).optional(),
    notes: z.string().optional(),
  }),
});