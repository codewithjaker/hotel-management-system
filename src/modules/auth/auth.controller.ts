import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { catchAsync } from "../../utils/catchAsync";
import { ApiResponse } from "../../utils/apiResponse";

export class AuthController {
    // Add this method inside AuthController class
static register = catchAsync(async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, hotelId } = req.body;
  const result = await AuthService.register({
    firstName,
    lastName,
    email,
    password,
    hotelId,
  });
  res.status(201).json(new ApiResponse(201, result, "Registration successful"));
});
  static login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.status(200).json(new ApiResponse(200, result, "Login successful"));
  });

  static refresh = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const result = await AuthService.refreshToken(refreshToken);
    res.status(200).json(new ApiResponse(200, result, "Token refreshed"));
  });

  static logout = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    await AuthService.logout(userId);
    res.status(200).json(new ApiResponse(200, null, "Logout successful"));
  });
}