import dotenv from "dotenv";
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "3000"),
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/hotel",
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  REDIS_PREFIX: process.env.REDIS_PREFIX || "hotel:",
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "access_secret_change_me",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "refresh_secret_change_me",
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || "15m",
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || "7d",
};