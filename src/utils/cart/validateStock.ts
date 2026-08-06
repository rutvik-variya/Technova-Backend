import { ApiError } from "../ApiError";
import { CART_MESSAGE } from "../../types/cart.types";

export const validateStock =(
    availableStock: number,
    requestedQuantity: number
) => {
    if (requestedQuantity > availableStock) {
        throw new ApiError(400, CART_MESSAGE.OUT_OF_STOCK);
    }
}