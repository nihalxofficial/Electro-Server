import { catchAsync } from "@/utils/catchAsync";
import { apiResponse } from "@/utils/apiResponse";
import { ApiError } from "@/utils/apiError";
import * as productService from "./product.service";
import { getProductsQuerySchema } from "./product.validator";

export const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body);
  apiResponse(res, 201, product, "Product created");
});

export const getProducts = catchAsync(async (req, res, next) => {
  const parsed = getProductsQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return next(new ApiError(400, parsed.error.issues[0].message));
  }
  const result = await productService.getProducts(parsed.data);
  apiResponse(res, 200, result);
});

export const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProduct(req.params.id as string, req.body);
  apiResponse(res, 200, product, "Product updated");
});

export const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProduct(req.params.id as string);
  apiResponse(res, 200, null, "Product deleted");
});