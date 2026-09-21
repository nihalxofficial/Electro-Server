import { Router } from "express";
import * as transactionController from "./transaction.controller";

const router = Router();

router.get("/", transactionController.getTransactions);

export default router;