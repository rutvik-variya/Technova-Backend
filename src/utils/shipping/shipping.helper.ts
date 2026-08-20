import { ApiError } from "../ApiError";
import { CalculateShippingInput, SHIPPING_MESSAGE, ShippingResult } from "../../types/shipping.types";

export const calculateShippingCharge = ({
    shippingMethod,
    subtotal
}: CalculateShippingInput): ShippingResult => {

    if (subtotal < 0) {
        throw new ApiError(400, SHIPPING_MESSAGE.INVALID_SUBTOTAL)
    }

    if (
        shippingMethod.method === "STANDARD" &&
        shippingMethod.freeShippingAbove !== null &&
        subtotal >= Number(shippingMethod.freeShippingAbove)
    ) {
        return {
            method: shippingMethod.method,
            charge: 0,
            estimatedDays: shippingMethod.estimatedDays,
        };
    }

    return {
        method: shippingMethod.method,
        charge: shippingMethod.baseCharge,
        estimatedDays: shippingMethod.estimatedDays,
    };
}