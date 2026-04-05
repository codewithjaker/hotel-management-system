// src/config/db.ts
import mongoose from "mongoose";
import { env } from "./env";
import logger from "./logger"; // assuming you have a logger utility

/**
 * MongoDB connection options
 * Adjust according to your needs
 */
const options: mongoose.ConnectOptions = {
  autoIndex: env.NODE_ENV === "development", // Enable auto-index only in dev
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4, // Use IPv4, skip trying IPv6
};

/**
 * Connect to MongoDB
 */
export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.MONGODB_URI, options);
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

/**
 * Handle connection events
 */
mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected, attempting to reconnect...");
});

mongoose.connection.on("reconnected", () => {
  logger.info("MongoDB reconnected");
});

mongoose.connection.on("error", (err) => {
  logger.error("MongoDB connection error:", err);
});

/**
 * Graceful shutdown
 */
export const closeDB = async (): Promise<void> => {
  await mongoose.connection.close();
  logger.info("MongoDB connection closed");
};

// Optional: handle application termination
process.on("SIGINT", async () => {
  await closeDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await closeDB();
  process.exit(0);
});