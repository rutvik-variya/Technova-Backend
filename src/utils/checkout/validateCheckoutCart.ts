import { ApiError } from "../ApiError";
import { CHECKOUT_MESSAGE } from "../../types/checkout.types";


export const validateCheckoutCart = (
    cart: any
) => {

    if (!cart) {
        throw new ApiError(400, CHECKOUT_MESSAGE.CART_EMPTY);
    }

    if (!cart.cartItems || cart.cartItems.length === 0) {
        throw new ApiError(400, CHECKOUT_MESSAGE.CART_EMPTY);
    }

    return true;
}