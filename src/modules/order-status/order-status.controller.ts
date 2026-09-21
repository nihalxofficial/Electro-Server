import { catchAsync } from "../../utils/catchAsync";
import { apiResponse } from "../../utils/apiResponse";
import { ApiError } from "../../utils/apiError";
import * as orderStatusService from "./order-status.service";

export const getOrderStatusHistory = catchAsync(async (req, res) => {
  const orderId = req.query.orderId as string;
  if (!orderId) throw new ApiError(400, "orderId is required");

  const history = await orderStatusService.getOrderStatusHistory(orderId);
  apiResponse(res, 200, history);
});