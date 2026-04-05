import { Request, Response, NextFunction } from "express";
import { getRedisClient } from "../config/redis";
import { env } from "../config/env";
import { ApiError } from "../utils/apiResponse";

export const rateLimitMiddleware = (limit: number = env.RATE_LIMIT_MAX_REQUESTS, windowMs: number = env.RATE_LIMIT_WINDOW_MS) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const redis = getRedisClient();
    const key = `rate_limit:${req.ip}`;
    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, Math.ceil(windowMs / 1000));
    }
    if (current > limit) {
      return next(new ApiError(429, "Too many requests, please try again later"));
    }
    next();
  };
};