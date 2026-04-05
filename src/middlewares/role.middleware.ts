import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiResponse";

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return next(new ApiError(401, "Unauthenticated"));
    if (!allowedRoles.includes(user.role)) {
      return next(new ApiError(403, "Forbidden: insufficient permissions"));
    }
    next();
  };
};