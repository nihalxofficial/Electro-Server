import { catchAsync } from "../../utils/catchAsync";
import { apiResponse } from "../../utils/apiResponse";
import { ApiError } from "../../utils/apiError";
import * as wishlistService from "./wishlist.service";

export const getWishlist = catchAsync(async (req, res) => {
  const userId = req.query.userId as string;
  if (!userId) throw new ApiError(400, "userId is required");

  const wishlist = await wishlistService.getWishlistByUserId(userId);
  apiResponse(res, 200, wishlist);
});

export const addToWishlist = catchAsync(async (req, res) => {
  const item = await wishlistService.addToWishlist(req.body.userId, req.body.productId);
  apiResponse(res, 201, item, "Added to wishlist");
});

export const removeFromWishlist = catchAsync(async (req, res) => {
  await wishlistService.removeFromWishlist(req.body.userId, req.params.productId as string);
  apiResponse(res, 200, null, "Removed from wishlist");
});