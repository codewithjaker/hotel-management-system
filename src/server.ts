import mongoose from "mongoose";
import app from "./app";
import config from "./config/env";

async function startServer() {
  try {
    await mongoose.connect(config.DB_URI);
    console.log("Database connected");

    app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
    });
  } catch (error) {
    console.error("Server failed:", error);
  }
}

startServer();
