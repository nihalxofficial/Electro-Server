import { Router } from "express";
import * as orderStatusController from "./order-status.controller";

const router = Router();

router.get("/", orderStatusController.getOrderStatusHistory);

export default router;