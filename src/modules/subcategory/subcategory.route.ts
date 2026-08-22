import { Router } from "express";
import { validate } from "@/utils/validate";
import { createSubCategorySchema, updateSubCategorySchema } from "./subcategory.validator";
import * as subCategoryController from "./subcategory.controller";

const router = Router();

router.get("/", subCategoryController.getSubCategories);
router.post("/", validate(createSubCategorySchema), subCategoryController.createSubCategory);
router.patch("/:id", validate(updateSubCategorySchema), subCategoryController.updateSubCategory);
router.delete("/:id", subCategoryController.deleteSubCategory);

export default router;