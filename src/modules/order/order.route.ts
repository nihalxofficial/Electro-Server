import { Router } from "express";
import { validate } from "../../utils/validate";
import { createOrderSchema, updateOrderStatusSchema } from "./order.validator";
import * as orderController from "./order.controller";

const router = Router();

router.get("/", orderController.getOrders);
router.get("/:id", orderController.getOrderById);
router.post("/", validate(createOrderSchema), orderController.createOrder);
router.patch("/:id/status", validate(updateOrderStatusSchema), orderController.updateOrderStatus);

export default router;