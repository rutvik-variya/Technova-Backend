import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import { addWishlistSchema, removeWishlistSchema } from "../validators/wishlist.validator";
import { addWishlist, clearWishlist, getWishlist, moveWishlistToCart, removeWishlist } from "../controller/wishlist.controller";

const router = Router();

router.post(
    "/",
    authenticate,
    validate({
        body: addWishlistSchema
    }),
    addWishlist
);

router.get(
    "/",
    authenticate,
    getWishlist
)


router.delete(
    "/:productId",
    authenticate,
    validate({
        params: removeWishlistSchema,
    }),
    removeWishlist
);
router.delete(
    "/",
    authenticate,
    clearWishlist
);

router.post(
    "/:productId/move-to-cart",
    authenticate,
    moveWishlistToCart
);

export default router;
