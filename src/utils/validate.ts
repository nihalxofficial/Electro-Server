import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "./apiError";

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return next(new ApiError(400, parsed.error.issues[0].message));
    }
    req.body = parsed.data;
    next();
  };
}