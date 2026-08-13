import { ApiError } from "../ApiError";
import { CHECKOUT_MESSAGE } from "../../types/checkout.types";

export const validateCheckoutItems = (
    items: any[]
) => {
    for (const item of items) {

        if (!item.product) {
            throw new ApiError(404, CHECKOUT_MESSAGE.PRODUCT_NOT_FOUND);
        }

        if (!item.variant) {
            throw new ApiError(404, CHECKOUT_MESSAGE.VARIANT_NOT_FOUND);
        }
    }

    return true;
};

