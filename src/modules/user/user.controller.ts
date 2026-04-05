// @ts-nocheck
import { Request, Response } from "express";
import { UserService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { ApiError, ApiResponse } from "../../utils/apiResponse";

export class UserController {
  // Get all users (admin only)
  static getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const filter: any = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.status) filter.status = req.query.status;
    const { users, total } = await UserService.findAll(filter, page, limit);
    res.status(200).json(new ApiResponse(200, { users, total, page, limit }));
  });

  // Get single user by ID
  static getUserById = catchAsync(async (req: Request, res: Response) => {
    const user = await UserService.findById(req.params.id);
    if (!user) throw new ApiError(404, "User not found");
    res.status(200).json(new ApiResponse(200, user));
  });

  // Create new user (admin/manager)
  static createUser = catchAsync(async (req: Request, res: Response) => {
    const user = await UserService.create(req.body);
    res.status(201).json(new ApiResponse(201, user, "User created successfully"));
  });

  // Update user (admin/manager, or self)
  static updateUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const currentUser = (req as any).user; // set by auth middleware

    // Allow self-update or role-based update
    if (userId !== currentUser.id && currentUser.role !== "admin" && currentUser.role !== "manager") {
      throw new ApiError(403, "You can only update your own profile");
    }

    // Prevent role change if not admin
    if (req.body.role && currentUser.role !== "admin") {
      delete req.body.role;
    }

    const updatedUser = await UserService.updateById(userId, req.body);
    if (!updatedUser) throw new ApiError(404, "User not found");
    res.status(200).json(new ApiResponse(200, updatedUser, "User updated successfully"));
  });

  // Delete user (admin only)
  static deleteUser = catchAsync(async (req: Request, res: Response) => {
    await UserService.deleteById(req.params.id);
    res.status(204).json(new ApiResponse(204, null, "User deleted successfully"));
  });

  // Change own password
  static changePassword = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { oldPassword, newPassword } = req.body;
    await UserService.changePassword(userId, oldPassword, newPassword);
    res.status(200).json(new ApiResponse(200, null, "Password changed successfully"));
  });
}