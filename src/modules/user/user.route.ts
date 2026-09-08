import { Router } from "express";
import { validate } from "../../utils/validate";
import { updateUserSchema } from "./user.validator";
import * as userController from "./user.controller";

const router = Router();

router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.patch("/:id", validate(updateUserSchema), userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;