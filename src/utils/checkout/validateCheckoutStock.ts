import { ApiError } from "../ApiError";
import { CHECKOUT_MESSAGE } from "../../types/checkout.types";


export const validateCheckoutStock = (
    items: any[]
) => {

    for (const item of items) {
        if (item.quantity > item.variant.stock) {
            throw new ApiError(400, CHECKOUT_MESSAGE.INSUFFICIENT_STOCK);
        }
    }

    return true;
};