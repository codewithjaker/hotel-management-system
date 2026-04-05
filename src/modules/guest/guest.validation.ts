import { z } from "zod";

const idTypeEnum = ["passport", "nid", "driving_license", "other"] as const;

export const createGuestSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().optional(),
    email: z.string().email("Invalid email").optional(),
    phone: z.string().optional(),
    nationality: z.string().optional(),
    idType: z.enum(idTypeEnum).optional(),
    idNumber: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
    preferences: z.object({
      language: z.string().optional(),
      smoking: z.boolean().optional(),
      specialRequests: z.string().optional(),
    }).optional(),
    notes: z.string().optional(),
  }).refine(data => data.email || data.phone, {
    message: "Either email or phone must be provided",
    path: ["email", "phone"],
  }),
});

export const updateGuestSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    nationality: z.string().optional(),
    idType: z.enum(idTypeEnum).optional(),
    idNumber: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
    preferences: z.object({
      language: z.string().optional(),
      smoking: z.boolean().optional(),
      specialRequests: z.string().optional(),
    }).optional(),
    notes: z.string().optional(),
  }),
});

export const guestIdParamSchema = z.object({
  params: z.object({
    id: z.string().length(24, "Invalid guest ID"),
  }),
});

export const guestQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    search: z.string().optional(),
    nationality: z.string().optional(),
    country: z.string().optional(),
    idType: z.enum(idTypeEnum).optional(),
  }),
});