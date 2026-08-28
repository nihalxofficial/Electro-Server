import app from "../src/app";
import { connectDB } from "../src/config/db";

export default async function handler(req: any, res: any) {
  try {
    await connectDB();
  } catch (err: any) {
    console.error("Database connection error on Vercel:", err);
    // If it's just health check, still let Express respond
    if (req.url === "/" || req.url === "/api") {
      return app(req, res);
    }
    return res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: err?.message || String(err),
    });
  }

  return app(req, res);
}