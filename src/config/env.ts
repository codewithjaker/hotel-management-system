import dotenv from "dotenv";
dotenv.config();

export default {
  PORT: process.env.PORT || 5000,
  DB_URI: process.env.MONGODB_URI as string,
};
