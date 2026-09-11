import { Router } from "express";
import { validate } from "../../utils/validate";
import { wishlistActionSchema } from "./wishlist.validator";
import * as wishlistController from "./wishlist.controller";

const router = Router();

router.get("/", wishlistController.getWishlist);
router.post("/", validate(wishlistActionSchema), wishlistController.addToWishlist);
router.delete("/:productId", wishlistController.removeFromWishlist);

export default router;