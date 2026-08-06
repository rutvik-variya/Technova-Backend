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
    CREATED: "Order placed successfully.",
    CART_EMPTY: "Your cart is empty.",
    ADDRESS_NOT_FOUND: "Address not found.",
    PRODUCT_OUT_OF_STOCK: "Some products are out of stock.",
    ORDER_NOT_FOUND: "Order not found.",
    ORDER_CANCELLED: "Order cancelled successfully."
};