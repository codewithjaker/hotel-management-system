// import mongoose from "mongoose";
// import app from "./app";
// import { env as config } from "./config/env";

// async function startServer() {
//   try {
//     await mongoose.connect(config.MONGODB_URI);
//     console.log("Database connected");

//     app.listen(config.PORT, () => {
//       console.log(`Server running on port ${config.PORT}`);
//     });
//   } catch (error) {
//     console.error("Server failed:", error);
//   }
// }

// startServer();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import { connectDB } from "./config/db";
import logger from "./config/logger";
import { env } from "./config/env";
import { getRedisClient } from "./config/redis";
// import { emailQueue, bookingCleanupQueue, pricingSyncQueue } from "./jobs/queue";

const PORT = env.PORT || 5000;
const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("dev", { stream: { write: (msg) => logger.info(msg.trim()) } }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/api", routes);

// Error handling (should be last)
app.use(errorMiddleware);

// Start server only after DB connection
const startServer = async () => {
  try {
    // Connect to Redis
    getRedisClient();
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
