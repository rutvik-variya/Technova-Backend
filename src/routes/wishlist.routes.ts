import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import { addWishlistSchema, removeWishlistSchema, syncWishlistSchema } from "../validators/wishlist.validator";
import { addWishlist, clearWishlist, getWishlist, moveWishlistToCart, removeWishlist, syncWishlist } from "../controller/wishlist.controller";

const router = Router();

router.post(
    "/",
    authenticate,
    validate({
        body: addWishlistSchema
    }),
    addWishlist
);

router.post(
    "/sync",
    authenticate,
    validate({
        body: syncWishlistSchema,
    }),
    syncWishlist
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
