import prisma from "../lib/prisma";
import { CreateOrderDto, ORDER_MESSAGE } from "../types/order.types";
import { ApiError } from "../utils/ApiError";
import { calculateOrderTotals } from "../utils/order/calculateOrderTotals";
import { clearCart } from "../utils/order/clearCart";
import { createOrderItem } from "../utils/order/createOrderItems";
import { generateOrderNumber } from "../utils/order/generateOrderNumber";
import { getAddressForOrder } from "../utils/order/getAddressForOrder";
import { getCartForOrder } from "../utils/order/getCartForOrder";
import { updateInventory } from "../utils/order/updateInventory";
import { validateOrderCart } from "../utils/order/validateOrderCart";

export const createOrderService = async (
    userId: string,
    payload: CreateOrderDto
) => {

    return prisma.$transaction(
        async (tx) => {
            const cart = await getCartForOrder(tx, userId);
            if (!cart) {
                throw new ApiError(400, ORDER_MESSAGE.CART_EMPTY);
            }

            validateOrderCart(cart)

            const address = await getAddressForOrder(
                tx,
                userId,
                payload.addressId
            )

            if (!address) {
                throw new ApiError(404, ORDER_MESSAGE.ADDRESS_NOT_FOUND);
            }

            const total = calculateOrderTotals(cart.cartItems);
            const orderNumber = generateOrderNumber();

            const order =
                await tx.order.create({
                    data: {
                        orderNumber,
                        userId,
                        addressId: address.id,
                        status: "PENDING",
                        paymentStatus: "PENDING",
                        paymentMethod: payload.paymentMethod,

                        subtotal: total.subtotal,
                        discount: total.discount,
                        shippingCharge: total.shippingCharge,
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

            const orderItems = createOrderItem(cart.cartItems);
            
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

            return {
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
                tax: Number(order.tax),
                grandTotal: Number(
                    order.grandTotal
                ),
            };

        },
        {
            timeout: 5000,
            maxWait: 2000,
        }

    )
};