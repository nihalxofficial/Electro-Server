import { catchAsync } from "../../utils/catchAsync";
import { apiResponse } from "../../utils/apiResponse";
import { ApiError } from "../../utils/apiError";
import * as cartService from "./cart.service";

export const getCart = catchAsync(async (req, res) => {
  const userId = (req.query.userId || req.params.userId) as string;
  if (!userId) throw new ApiError(400, "userId is required");

  const cart = await cartService.getCartByUserId(userId);
  apiResponse(res, 200, cart, "Cart fetched successfully");
});

export const addToCart = catchAsync(async (req, res) => {
  const { userId, productId, quantity } = req.body;
  const item = await cartService.addToCart(userId, productId, quantity);
  apiResponse(res, 201, item, "Added to cart");
});

export const updateCartItem = catchAsync(async (req, res) => {
  const { userId, quantity } = req.body;
  const item = await cartService.updateCartItem(userId, req.params.productId as string, quantity);
  apiResponse(res, 200, item, "Cart updated");
});

export const removeFromCart = catchAsync(async (req, res) => {
  const userId = (req.body?.userId || req.query?.userId) as string;
  if (!userId) throw new ApiError(400, "userId is required");
  await cartService.removeFromCart(userId, req.params.productId as string);
  apiResponse(res, 200, null, "Removed from cart");
});

export const clearCart = catchAsync(async (req, res) => {
  const userId = (req.body?.userId || req.query?.userId) as string;
  if (!userId) throw new ApiError(400, "userId is required");
  await cartService.clearCart(userId);
  apiResponse(res, 200, null, "Cart cleared");
});

export const isCarted = catchAsync(async (req, res) => {
  const userId = (req.query.userId || req.params.userId || req.body?.userId) as string;
  const productId = (req.query.productId || req.params.productId || req.body?.productId) as string;
  if (!userId || !productId) throw new ApiError(400, "userId and productId are required");

  const result = await cartService.isCarted(userId, productId);
  apiResponse(res, 200, result, "Cart status fetched successfully");
});