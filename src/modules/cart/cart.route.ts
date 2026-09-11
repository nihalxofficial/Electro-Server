import { Router } from "express";
import { validate } from "../../utils/validate";
import { addToCartSchema, updateCartItemSchema } from "./cart.validator";
import * as cartController from "./cart.controller";

const router = Router();

router.get("/", cartController.getCart);
router.get("/user/:userId", cartController.getCart);
router.post("/", validate(addToCartSchema), cartController.addToCart);
router.patch("/:productId", validate(updateCartItemSchema), cartController.updateCartItem);
router.delete("/:productId", cartController.removeFromCart);
router.delete("/", cartController.clearCart);

export default router;