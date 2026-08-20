import { ShippingMethod } from "@prisma/client";


export interface ShippingMethodConfig {
    method: ShippingMethod;
    baseCharge: number;
    freeShippingAbove: number;
    estimatedDays: number;
}

export interface CalculateShippingInput {
    shippingMethod: ShippingMethodConfig;
    subtotal: number;
}

export interface ShippingResult {
    method: ShippingMethod;
    charge: number;
    estimatedDays: number;
}

export const SHIPPING_MESSAGE = {
    INVALID_SUBTOTAL: "Invalid subtotal",
    FETCH_SHIPPING: "Shipping methods fetched successfully"
}