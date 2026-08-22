import app from "./app";
import { connectDB } from "@/config/db";
import { ENV } from "@/config/env";

async function startServer() {
  await connectDB();
  app.listen(ENV.PORT, () => {
    console.log(`Server running on port ${ENV.PORT}`);
  });
}

startServer();