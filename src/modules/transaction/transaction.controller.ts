import { catchAsync } from "../../utils/catchAsync";
import { apiResponse } from "../../utils/apiResponse";
import { ApiError } from "../../utils/apiError";
import * as transactionService from "./transaction.service";
import { getTransactionsQuerySchema } from "./transaction.validator";

export const getTransactions = catchAsync(async (req, res, next) => {
  const parsed = getTransactionsQuerySchema.safeParse(req.query);
  if (!parsed.success) return next(new ApiError(400, parsed.error.issues[0].message));

  const { userId, orderId } = parsed.data;
  if (!userId && !orderId) throw new ApiError(400, "userId or orderId is required");

  const transactions = await transactionService.getTransactions({ userId, orderId });
  apiResponse(res, 200, transactions);
});