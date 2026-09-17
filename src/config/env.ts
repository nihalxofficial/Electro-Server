import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI as string,
  NEXT_PUBLIC_CLIENT_URL: process.env.NEXT_PUBLIC_CLIENT_URL as string,
};

if (!ENV.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in .env");
}

if (!ENV.NEXT_PUBLIC_CLIENT_URL) {
  throw new Error("NEXT_PUBLIC_CLIENT_URL is not defined in .env");
}