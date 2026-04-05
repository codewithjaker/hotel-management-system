import { z } from "zod";

const objectId = z.string().length(24, "Invalid hotel ID");

export const reportQuerySchema = z.object({
  query: z.object({
    hotelId: objectId.optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    groupBy: z.enum(["day", "week", "month", "year"]).optional(),
  }).refine(data => new Date(data.endDate) >= new Date(data.startDate), {
    message: "endDate must be after startDate",
    path: ["endDate"],
  }),
});

export const dashboardQuerySchema = z.object({
  query: z.object({
    hotelId: objectId.optional(),
  }),
});