import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";
import { ApiError } from "../utils/apiResponse";

export const validate = (schema: ZodObject, source: "body" | "params" | "query" = "body") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = source === "body" ? req.body : source === "params" ? req.params : req.query;
      await schema.parseAsync({ [source]: data });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err) => `${err.path.join(".")}: ${err.message}`);
        return next(new ApiError(400, "Validation failed", errors));
      }
      next(error);
    }
  };
};