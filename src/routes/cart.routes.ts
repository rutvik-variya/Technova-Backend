import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.middleware";
import validate from "../middleware/validate.middleware";
import { addToCartSchema, updateCartItemSchema } from "../validators/cart.validator";
import { addToCart, clearCart, getUserCart, removeCartItem, updateCartItem } from "../controller/cart.controller";

const router = Router();

router.post(
    "/",
    authenticate,
    validate({
        body: addToCartSchema
    }),
    addToCart
)

router.get(
    "/",
    authenticate,
    getUserCart
);

router.patch(
    "/item/:itemId",
    authenticate,
    validate({
        body: updateCartItemSchema

    }),
    updateCartItem
)

router.delete(
    "/item/:itemId",
    authenticate,
    removeCartItem
);

router.delete(
  "/",
  authenticate,
  clearCart
);

export default router;