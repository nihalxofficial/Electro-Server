import { catchAsync } from "../../utils/catchAsync";
import { apiResponse } from "../../utils/apiResponse";
import { ApiError } from "../../utils/apiError";
import * as orderService from "./order.service";

export const createOrder = catchAsync(async (req, res) => {
  const order = await orderService.createOrder(req.body);
  apiResponse(res, 201, order, "Order placed successfully");
});

export const getOrders = catchAsync(async (req, res) => {
  const userId = req.query.userId as string;
  if (!userId) throw new ApiError(400, "userId is required");

  const orders = await orderService.getOrdersByUserId(userId);
  apiResponse(res, 200, orders);
});

export const getOrderById = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id as string);
  apiResponse(res, 200, order);
});

export const updateOrderStatus = catchAsync(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id as string, req.body);
  apiResponse(res, 200, order, "Order status updated");
});