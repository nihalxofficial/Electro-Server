import { Router } from "express";
import { validate } from "@/utils/validate";
import { createProductSchema, updateProductSchema } from "./product.validator";
import * as productController from "./product.controller";

const router = Router();

router.get("/", productController.getProducts);
router.post("/", validate(createProductSchema), productController.createProduct);
router.patch("/:id", validate(updateProductSchema), productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export default router;