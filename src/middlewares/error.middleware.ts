// import { Request, Response, NextFunction } from "express";

// export default function errorHandler(
//   err: any,
//   _req: Request,
//   res: Response,
//   _next: NextFunction
// ) {
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//   });
// }

// src/middlewares/error.middleware.ts

import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { ApiError } from "../utils/apiResponse";
// import logger from "../config/logger"; // assuming you have a winston/pino logger

export const errorMiddleware = (
  err: Error | ApiError | any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default values
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: any[] | undefined;

  // Handle our custom ApiError
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }
  // Handle Mongoose validation errors
  else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Validation Error";
    errors = Object.values(err.errors).map((e) => e.message);
  }
  // Handle Mongoose duplicate key error (code 11000)
  else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern)[0];
    message = `Duplicate value for ${field}. Please use another value.`;
  }
  // Handle CastError (invalid ObjectId)
  else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }
  // Handle JWT errors (if any, from auth middleware)
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }
  // For any other error, keep defaults

  // Log the full error (except in production we may limit)
  // logger.error({
  //   statusCode,
  //   message,
  //   stack: err.stack,
  //   originalError: err,
  // });

  // Send response
  res.status(statusCode).json({
    statusCode,
    message,
    ...(errors && { errors }),
    // Only show stack in development
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};