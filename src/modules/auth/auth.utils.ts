//@ts-nocheck
import jwt from "jsonwebtoken";
import { IJwtPayload, ITokens } from "./auth.types";
import { env } from "../../config/env";

export const generateTokens = (payload: IJwtPayload): ITokens => {
  const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRY,
  });
  const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRY,
  });
  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): IJwtPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as IJwtPayload;
};

export const verifyRefreshToken = (token: string): IJwtPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as IJwtPayload;
};
