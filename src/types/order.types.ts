import { PaymentMethod } from "@prisma/client";


export interface CreateOrderDto {
    addressId: string,
    paymentMethod: PaymentMethod;
}

export interface OrderTotals {
    subtotal: number;
    shippingCharge: number;
    tax: number;
    discount: number;
    grandTotal: number;
}


export const ORDER_MESSAGE = {
    CART_EMPTY: "Your cart is empty.",
    ADDRESS_NOT_FOUND: "Address not found.",
    ADDRESS_NOT_OWNED: "This address does not belong to you.",
    PRODUCT_OUT_OF_STOCK: "Some products are out of stock.",
    INSUFFICIENT_STOCK: "Insufficient product stock.",
    PRODUCT_UNAVAILABLE: "One or more products are unavailable.",
    ORDER_CREATED: "Order placed successfully.",

    ORDER_NOT_FOUND: "Order not found.",
    ORDER_CANCELLED: "Order cancelled successfully."
};