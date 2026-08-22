import { catchAsync } from "@/utils/catchAsync";
import { apiResponse } from "@/utils/apiResponse";
import * as productService from "./product.service";

export const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body);
  apiResponse(res, 201, product, "Product created");
});

export const getProducts = catchAsync(async (req, res) => {
  const categoryId = req.query.categoryId as string | undefined;
  const products = await productService.getProducts(categoryId);
  apiResponse(res, 200, products);
});

export const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  apiResponse(res, 200, product, "Product updated");
});

export const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  apiResponse(res, 200, null, "Product deleted");
});