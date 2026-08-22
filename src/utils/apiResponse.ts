import { Response } from "express";

export function apiResponse(res: Response, statusCode: number, data: unknown, message = "Success") {
  return res.status(statusCode).json({ success: true, message, data });
}