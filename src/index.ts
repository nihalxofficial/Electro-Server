import app from "./app";
import { connectDB } from "./config/db";
import { ENV } from "./config/env";
import { syncAllProductRatings } from "./modules/review/review.service";

async function startServer() {
  await connectDB();
  await syncAllProductRatings();
  app.listen(ENV.PORT, () => {
    console.log(`Server running on port ${ENV.PORT}`);
  });
}

startServer();