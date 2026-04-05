import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, "First name required"),
    lastName: z.string().min(1, "Last name required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["admin", "manager", "receptionist"]).optional(),
    hotelId: z.string().length(24, "Invalid hotel ID").optional(),
    status: z.enum(["active", "inactive", "suspended"]).optional(),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    email: z.string().email().optional(),
    role: z.enum(["admin", "manager", "receptionist"]).optional(),
    status: z.enum(["active", "inactive", "suspended"]).optional(),
    hotelId: z.string().length(24).optional(),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1, "Old password required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
  }),
});

export const userIdParamSchema = z.object({
  params: z.object({
    id: z.string().length(24, "Invalid user ID"),
  }),
});