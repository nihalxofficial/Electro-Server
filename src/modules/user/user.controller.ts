import { catchAsync } from "../../utils/catchAsync";
import { apiResponse } from "../../utils/apiResponse";
import { ApiError } from "../../utils/apiError";
import * as userService from "./user.service";
import { getUsersQuerySchema } from "./user.validator";

export const getUsers = catchAsync(async (req, res, next) => {
  const parsed = getUsersQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return next(new ApiError(400, parsed.error.issues[0].message));
  }
  const result = await userService.getUsers(parsed.data);
  apiResponse(res, 200, result, "Users fetched successfully");
});

export const getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id as string);
  apiResponse(res, 200, user);
});

export const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUser(req.params.id as string, req.body);
  apiResponse(res, 200, user, "User updated");
});

export const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUser(req.params.id as string);
  apiResponse(res, 200, null, "User deleted");
});