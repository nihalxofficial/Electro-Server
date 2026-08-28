import express from "express";
import cors from "cors";
import categoryRoutes from "./modules/category/category.route";
import subCategoryRoutes from "./modules/subcategory/subcategory.route";
import productRoutes from "./modules/product/product.route";
import { errorMiddleware } from "./middlewares/error.middleware";
import { notFound } from "./middlewares/notFound.middleware";

const app = express();

app.use(cors());
app.use(express.json());

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api", (_req, res) => {
  res.json({ success: true, message: "Electro server is running✅" });
});

app.get("/", (_req, res) => {
  res.json({ success: true, message: "Electro server API is running✅" });
});

app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/products", productRoutes);

app.use(notFound);
app.use(errorMiddleware);

export default app;