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
import { createOrderStatusHistory } from "../utils/order/createOrderStatusHistory";
import { getOrderStatusHistory } from "../utils/order/getOrderStatusHistory";
import { orderTimelineResponse } from "../utils/order/orderTimelineResponse";
import { consumeCouponForOrder, validateCouponForOrder } from "../utils/coupon/couponHelper";
import { SHIPPING_MESSAGE } from "../types/shipping.types";
import { calculateShippingCharge } from "../utils/shipping/shipping.helper";


export const createOrderService = async (
    userId: string,
    payload: CreateOrderDto
) => {
    return prisma.$transaction(
        async (tx) => {
            // 1. Fetch cart
            const cart = await getCartForOrder(tx, userId);

            if (!cart) {
                throw new ApiError(400, ORDER_MESSAGE.CART_EMPTY);
            }

            validateOrderCart(cart);

            // 2. Fetch address
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

            // 3. Calculate subtotal
            const subtotalTotals = calculateOrderTotals(
                cart.cartItems,
                null
            );

            // 4. Validate coupon
            let coupon = null;

            if (cart.couponId) {
                coupon = await validateCouponForOrder(
                    tx,
                    cart.couponId,
                    userId,
                    subtotalTotals.subtotal
                );
            }

            // 5. Calculate final totals
            const totals = calculateOrderTotals(
                cart.cartItems,
                coupon
            );

            // 6. Fetch shipping configuration
            const shippingMethod =
                await tx.shippingMethodConfig.findUnique({
                    where: {
                        method: payload.shippingMethod,
                    },
                });

            if (!shippingMethod || !shippingMethod.isActive) {
                throw new ApiError(
                    400,
                    SHIPPING_MESSAGE.INVALID_SHIPPING_METHOD
                );
            }

            // 7. Calculate shipping
            const shipping = calculateShippingCharge({
                shippingMethod: {
                    ...shippingMethod,
                    baseCharge: Number(shippingMethod.baseCharge),
                    freeShippingAbove: Number(
                        shippingMethod.freeShippingAbove
                    ),
                },
                subtotal: totals.subtotal,
            });

            // 8. Calculate grand total
            const grandTotal =
                totals.subtotal -
                totals.discount +
                shipping.charge +
                totals.tax;

            // 9. Create order
            const order = await tx.order.create({
                data: {
                    orderNumber: generateOrderNumber(),
                    userId,
                    addressId: address.id,

                    status: "PENDING",
                    paymentStatus: "PENDING",
                    paymentMethod: payload.paymentMethod,

                    shippingMethod: payload.shippingMethod,
                    shippingStatus: "PENDING",

                    subtotal: totals.subtotal,
                    discount: totals.discount,
                    shippingCharge: shipping.charge,
                    tax: totals.tax,
                    grandTotal,

                    couponId: coupon?.id ?? null,
                    couponCode: coupon?.code ?? null,
                },
                select: {
                    id: true,
                    orderNumber: true,
                    status: true,
                    paymentStatus: true,
                    paymentMethod: true,
                    shippingMethod: true,
                    shippingStatus: true,
                    subtotal: true,
                    discount: true,
                    shippingCharge: true,
                    tax: true,
                    grandTotal: true,
                    couponId: true,
                    couponCode: true,
                    createdAt: true,
                },
            });

            // 10. Create order items
            const orderItems = createOrderItem(cart.cartItems);

            await tx.orderItem.createMany({
                data: orderItems.map((item) => ({
                    orderId: order.id,
                    ...item,
                })),
            });

            // 11. Bulk inventory deduction
            await updateInventory(tx, cart.cartItems);

            // 12. Consume coupon
            if (coupon) {
                await consumeCouponForOrder(
                    tx,
                    coupon.id,
                    userId,
                    order.id,
                    coupon.usageLimit
                );
            }

            // 13. Clear cart
            await clearCart(tx, cart.id);

            // 14. Create order history
            await tx.orderStatusHistory.create({
                data: {
                    orderId: order.id,
                    fromStatus: null,
                    toStatus: "PENDING",
                    changedById: null,
                    note: "Order created",
                },
            });

            // 15. Return response
            return {
                ...order,
                subtotal: Number(order.subtotal),
                discount: Number(order.discount),
                shippingCharge: Number(order.shippingCharge),
                tax: Number(order.tax),
                grandTotal: Number(order.grandTotal),
            };
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
        adminId: string,
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

                const updateOrder = updateOrderStatus(
                    tx,
                    orderId,
                    order.status,
                    payload.status
                );

                await createOrderStatusHistory(
                    tx,
                    {
                        orderId,
                        fromStatus: order.status,
                        toStatus: payload.status,
                        changedById: adminId,
                        note: payload.note
                    }
                )
                return updateOrder;
            }
        );
    };

export const getOrderStatusHistoryService = async (
    orderId: string
) => {

    const order = await prisma.order.findUnique({
        where: {
            id: orderId,
        },
        select: {
            id: true,
        },
    });

    if (!order) {
        throw new ApiError(404, ORDER_MESSAGE.ORDER_NOT_FOUND);
    }

    const history = await getOrderStatusHistory(
        prisma,
        orderId
    );

    return orderTimelineResponse(
        history
    );
};


