import { catchAsync } from "@/utils/catchAsync";
import { apiResponse } from "@/utils/apiResponse";
import * as categoryService from "./category.service";

export const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  apiResponse(res, 201, category, "Category created");
});

export const getCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.getCategories();
  apiResponse(res, 200, categories);
});

export const updateCategory = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  apiResponse(res, 200, category, "Category updated");
});

export const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  apiResponse(res, 200, null, "Category deleted");
});