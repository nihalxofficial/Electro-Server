import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";

export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.role || !allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, "You don't have permission to perform this action"));
    }
    next();
  };
}