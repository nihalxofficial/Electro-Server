import { catchAsync } from "../../utils/catchAsync";
import { apiResponse } from "../../utils/apiResponse";
import { ApiError } from "../../utils/apiError";
import * as wishlistService from "./wishlist.service";

export const getWishlist = catchAsync(async (req, res) => {
  const userId = (req.params.userId || req.query.userId) as string;
  if (!userId) throw new ApiError(400, "userId is required");

  const wishlist = await wishlistService.getWishlistByUserId(userId);
  apiResponse(res, 200, wishlist, "Wishlist fetched successfully");
});

export const addToWishlist = catchAsync(async (req, res) => {
  const item = await wishlistService.addToWishlist(req.body.userId, req.body.productId);
  apiResponse(res, 201, item, "Added to wishlist");
});

export const removeFromWishlist = catchAsync(async (req, res) => {
  await wishlistService.removeFromWishlist(req.body.userId, req.params.productId as string);
  apiResponse(res, 200, null, "Removed from wishlist");
});

export const isWishlisted = catchAsync(async (req, res) => {
  const userId = (req.query.userId || req.params.userId || req.body?.userId) as string;
  const productId = (req.query.productId || req.params.productId || req.body?.productId) as string;
  if (!userId || !productId) throw new ApiError(400, "userId and productId are required");

  const result = await wishlistService.isWishlisted(userId, productId);
  apiResponse(res, 200, result, "Wishlist status fetched successfully");
});