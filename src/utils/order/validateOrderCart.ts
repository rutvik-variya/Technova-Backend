import { ApiError } from "../ApiError";
import { ORDER_MESSAGE } from "../../types/order.types";

export const validateOrderCart = (cart: any) => {
    if (!cart || cart.cartItems.length == 0) {
        throw new ApiError(400, ORDER_MESSAGE.CART_EMPTY)
    }

    for (const item of cart.cartItems) {
        if (!item.product) {
            throw new ApiError(400, ORDER_MESSAGE.PRODUCT_UNAVAILABLE);
        }

        if (!item.variant) {
            throw new ApiError(400, ORDER_MESSAGE.PRODUCT_UNAVAILABLE);
        }

        if (item.variant.stock <= 0) {
            throw new ApiError(400, ORDER_MESSAGE.PRODUCT_OUT_OF_STOCK);
        }

        if (item.quantity > item.variant.stock) {
            throw new ApiError(
                400,
                `${ORDER_MESSAGE.INSUFFICIENT_STOCK}: ${item.product.name}`
            );
        }
    }
}