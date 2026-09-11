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
  await cartService.removeFromCart(req.body.userId, req.params.productId as string);
  apiResponse(res, 200, null, "Removed from cart");
});

export const clearCart = catchAsync(async (req, res) => {
  await cartService.clearCart(req.body.userId);
  apiResponse(res, 200, null, "Cart cleared");
});