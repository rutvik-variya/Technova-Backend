import { Prisma } from "@prisma/client";
import { ApiError } from "../../utils/ApiError";
import { ORDER_MESSAGE } from "../../types/order.types";

export const getOrderStatus = async (
    tx: Prisma.TransactionClient,
    orderId: string
) => {

    const order = await tx.order.findUnique({
        where: {
            id: orderId,
        },
        select: {
            id: true,
            status: true,
        },
    });
    if (!order) {
        throw new ApiError(
            404,
            ORDER_MESSAGE.ORDER_NOT_FOUND
        );
    }
    return order;
};
