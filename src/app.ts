import express from "express";
import cors from "cors";
import categoryRoutes from "@/modules/category/category.routes";
import subCategoryRoutes from "@/modules/subcategory/subcategory.routes";
import productRoutes from "@/modules/product/product.routes";
import { errorMiddleware } from "@/middlewares/error.middleware";
import { notFound } from "@/middlewares/notFound.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/products", productRoutes);

app.use(notFound);
app.use(errorMiddleware);

export default app;