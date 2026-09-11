import { Router } from "express";
import { validate } from "../../utils/validate";
import { createReviewSchema, updateReviewSchema } from "./review.validator";
import * as reviewController from "./review.controller";

const router = Router();

router.get("/", reviewController.getReviews);
router.post("/sync-ratings", reviewController.syncRatings);
router.post("/", validate(createReviewSchema), reviewController.createReview);
router.patch("/:id", validate(updateReviewSchema), reviewController.updateReview);
router.delete("/:id", reviewController.deleteReview);

export default router;