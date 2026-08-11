import { Prisma, OrderStatus } from "@prisma/client";
import { ApiError } from "../../utils/ApiError";
import { ORDER_MESSAGE } from "../../types/order.types";

export const updateOrderStatus = async (
    tx: Prisma.TransactionClient,
    orderId: string,
    currentStatus: OrderStatus,
    nextStatus: OrderStatus
) => {
    const result =
        await tx.order.updateMany({
            where: {
                id: orderId,
                status: currentStatus,
            },
            data: {
                status: nextStatus,
            },
        });

    if (result.count === 0) {
        throw new ApiError(
            409,
            ORDER_MESSAGE.INVALID_STATUS_TRANSITION
        );
    }

    const updatedOrder =
        await tx.order.findUnique({
            where: {
                id: orderId,
            },

            select: {
                id: true,
                orderNumber: true,
                status: true,
                paymentStatus: true,
                paymentMethod: true,
                grandTotal: true,
                updatedAt: true,
            },
        });

    if (!updatedOrder) {
        throw new ApiError(
            404,
            ORDER_MESSAGE.ORDER_NOT_FOUND
        );
    }
    return updatedOrder;
};