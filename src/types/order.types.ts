import { PaymentMethod } from "@prisma/client";
import { OrderStatus } from "@prisma/client";
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

export interface GetMyOrdersDto {
    page?: number,
    limit?: number,
    status?: OrderStatus
}
export interface GetOrderParams {
    orderId: string;
}

export interface OrderListItem {
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    subtotal: number;
    discount: number;
    shippingCharge: number;
    tax: number;
    grandTotal: number;
    itemCount: number;
    createdAt: Date;
}

export interface UpdateOrderStatusDto {
    status: OrderStatus;
    note?: string;
}

export const ORDER_MESSAGE = {
    CART_EMPTY: "Your cart is empty.",
    ADDRESS_NOT_FOUND: "Address not found.",
    ADDRESS_NOT_OWNED: "This address does not belong to you.",
    PRODUCT_OUT_OF_STOCK: "Some products are out of stock.",
    INSUFFICIENT_STOCK: "Insufficient product stock.",
    PRODUCT_UNAVAILABLE: "One or more products are unavailable.",
    ORDER_CREATED: "Order placed successfully.",
    ORDERS_FETCHED: "Orders fetched successfully",
    ORDER_FETCHED: "Order fetched successfully",

    ORDER_NOT_FOUND: "Order not found.",
    ORDER_CANCELLED: "Order cancelled successfully.",
    ORDER_CANNOT_BE_CANCELLED: "This order cannot be cancelled",
    ORDER_ALREADY_IN_STATUS: "Order already in status.",
    INVALID_STATUS_TRANSITION: "Invalid status transition",
    ORDER_STATUS_UPDATED: "Order status updated successfully",
    ORDER_TIMELINE_FETCH: "Order timeline fetched successfully"
};

