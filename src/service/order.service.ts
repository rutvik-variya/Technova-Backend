import { updateOrderStatus } from "../utils/order/updateOrderStatus";
import prisma from "../lib/prisma";
import { CreateOrderDto, ORDER_MESSAGE, UpdateOrderStatusDto } from "../types/order.types";
import { ApiError } from "../utils/ApiError";
import { adminOrderQueryBuilder } from "../utils/order/adminOrderQueryBuilder";
import { adminOrderResponse } from "../utils/order/adminOrderResponse";
import { calculateOrderTotals } from "../utils/order/calculateOrderTotals";
import { canCancelOrder } from "../utils/order/canCancelOrder";
import { cancelOrder } from "../utils/order/cancelOrder";
import { clearCart } from "../utils/order/clearCart";
import { createOrderItem } from "../utils/order/createOrderItems";
import { generateOrderNumber } from "../utils/order/generateOrderNumber";
import { getAddressForOrder } from "../utils/order/getAddressForOrder";
import { getAllOrders } from "../utils/order/getAllOrders";
import { getCartForOrder } from "../utils/order/getCartForOrder";
import { getMyOrders } from "../utils/order/getMyOrders";
import { getOrder } from "../utils/order/getOrder";
import { getOrderForCancellation } from "../utils/order/getOrderForCancellation";
import { getOrderStatus } from "../utils/order/getOrderStatus";
import { orderDetailResponse } from "../utils/order/orderDetailResponse";
import { orderListResponse } from "../utils/order/orderListResponse";
import { orderQueryBuilder } from "../utils/order/orderQueryBuilder";
import { validateOrderStatusTransition } from "../utils/order/orderStatusTransition";
import { restoreInventory } from "../utils/order/restoreInventory";
import { updateInventory } from "../utils/order/updateInventory";
import { validateOrderCart } from "../utils/order/validateOrderCart";
import { pagination } from "../utils/pagination";

export const createOrderService = async (
    userId: string,
    payload: CreateOrderDto
) => {

    return prisma.$transaction(
        async (tx) => {

            const cart = await getCartForOrder(
                tx,
                userId
            );

            if (!cart) {
                throw new ApiError(
                    400,
                    ORDER_MESSAGE.CART_EMPTY
                );
            }

            validateOrderCart(cart);

            const address = await getAddressForOrder(
                tx,
                userId,
                payload.addressId
            );

            if (!address) {
                throw new ApiError(
                    404,
                    ORDER_MESSAGE.ADDRESS_NOT_FOUND
                );
            }
            const total = calculateOrderTotals(
                cart.cartItems
            );
            const orderNumber = generateOrderNumber();

            const order =
                await tx.order.create({
                    data: {
                        orderNumber,
                        userId,
                        addressId: address.id,
                        status: "PENDING",
                        paymentStatus: "PENDING",
                        paymentMethod:
                            payload.paymentMethod,

                        subtotal: total.subtotal,
                        discount: total.discount,
                        shippingCharge:
                            total.shippingCharge,
                        tax: total.tax,
                        grandTotal: total.grandTotal,
                    },

                    select: {
                        id: true,
                        orderNumber: true,
                        status: true,
                        paymentStatus: true,
                        paymentMethod: true,
                        subtotal: true,
                        discount: true,
                        shippingCharge: true,
                        tax: true,
                        grandTotal: true,
                        createdAt: true,
                    },
                });

            const orderItems = createOrderItem(
                cart.cartItems
            );

            await tx.orderItem.createMany({
                data: orderItems.map(
                    (item) => ({
                        orderId: order.id,
                        ...item,
                    })
                ),
            });

            await updateInventory(
                tx,
                cart.cartItems
            );

            await clearCart(
                tx,
                cart.id
            );

            const result = {
                ...order,
                subtotal: Number(
                    order.subtotal
                ),
                discount: Number(
                    order.discount
                ),
                shippingCharge: Number(
                    order.shippingCharge
                ),
                tax: Number(
                    order.tax
                ),
                grandTotal: Number(
                    order.grandTotal
                ),
            };
            return result;
        },
        {
            timeout: 15000,
            maxWait: 2000,
        }
    );
};


export const getMyOrdersService = async (
    userId: string,
    query: Record<string, any>
) => {

    const options =
        orderQueryBuilder(
            userId,
            query
        );

    const {
        orders,
        total,
    } = await getMyOrders(
        prisma,
        {
            userId,
            ...options,
        }
    );

    return {
        data: orderListResponse(
            orders
        ),
        meta: pagination({
            page: options.page,
            limit: options.limit,
            total,
        }),
    };
};


export const getOrderService = async (
    userId: string,
    orderId: string
) => {

    const order = await getOrder(
        prisma,
        userId,
        orderId
    );

    return orderDetailResponse(
        order
    );
};


export const cancelOrderService = async (
    userId: string,
    orderId: string
) => {

    return prisma.$transaction(
        async (tx) => {

            // 1. Get order
            const order =
                await getOrderForCancellation(
                    tx,
                    userId,
                    orderId
                );

            // 2. Validate status
            canCancelOrder(
                order.status
            );

            // 3. Restore inventory
            await restoreInventory(
                tx,
                order.orderItems
            );

            // 4. Cancel order
            const cancelledOrder =
                await cancelOrder(
                    tx,
                    order.id
                );

            return cancelledOrder;
        }
    );
};


export const getAllOrdersService = async (
    query: Record<string, any>
) => {

    const options = adminOrderQueryBuilder(query);

    const { orders, total, } = await getAllOrders(
        prisma,
        {
            where: options.where,
            orderBy: options.orderBy,
            skip: options.skip,
            take: options.take,
        }
    );

    return {
        data: adminOrderResponse(orders),
        meta:
            pagination({
                page: options.page,
                limit: options.limit,
                total,
            }),
    };
};

export const updateOrderStatusService =
    async (
        orderId: string,
        payload: UpdateOrderStatusDto
    ) => {
        return prisma.$transaction(
            async (tx) => {

                const order = await getOrderStatus(
                        tx,
                        orderId
                );

                validateOrderStatusTransition(
                    order.status,
                    payload.status
                );

                return updateOrderStatus(
                    tx,
                    orderId,
                    order.status,
                    payload.status
                );
            }
        );
    };
