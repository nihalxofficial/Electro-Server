import { catchAsync } from "../../utils/catchAsync";
import { apiResponse } from "../../utils/apiResponse";
import * as subCategoryService from "./subcategory.service";

export const createSubCategory = catchAsync(async (req, res) => {
  const subCategory = await subCategoryService.createSubCategory(req.body);
  apiResponse(res, 201, subCategory, "Subcategory created");
});

export const getSubCategories = catchAsync(async (req, res) => {
  const categoryId = req.query.categoryId as string | undefined;
  const subCategories = await subCategoryService.getSubCategories(categoryId);
  apiResponse(res, 200, subCategories);
});

export const updateSubCategory = catchAsync(async (req, res) => {
  const subCategory = await subCategoryService.updateSubCategory(req.params.id as string, req.body);
  apiResponse(res, 200, subCategory, "Subcategory updated");
});

export const deleteSubCategory = catchAsync(async (req, res) => {
  await subCategoryService.deleteSubCategory(req.params.id as string);
  apiResponse(res, 200, null, "Subcategory deleted");
});