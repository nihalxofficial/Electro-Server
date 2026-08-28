import { Router } from "express";
import { validate } from "../../utils/validate";
import { createCategorySchema, updateCategorySchema } from "./category.validator";
import * as categoryController from "./category.controller";

const router = Router();

router.get("/", categoryController.getCategories);
router.post("/", validate(createCategorySchema), categoryController.createCategory);
router.patch("/:id", validate(updateCategorySchema), categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

export default router;