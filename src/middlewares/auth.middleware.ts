import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../modules/auth/auth.utils";
import { ApiError } from "../utils/apiResponse";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "No token provided"));
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyAccessToken(token);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired token"));
  }
};