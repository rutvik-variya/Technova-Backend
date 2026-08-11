import { ApiError } from "../ApiError";
import { ORDER_MESSAGE } from "../../types/order.types";
import { Prisma } from "@prisma/client";

export const getOrderForCancellation = async (
    tx: Prisma.TransactionClient,
    userId: string,
    orderId: string
) => {
    const order = await tx.order.findFirst({
        where: {
            id: orderId,
            userId
        },

        select: {
            id: true,
            status: true,
            orderItems: {
                select: {
                    id: true,
                    variantId: true,
                    quantity: true
                }
            }
        }
    })

    if (!order) {
        throw new ApiError(
            404,
            ORDER_MESSAGE.ORDER_NOT_FOUND
        );
    }

    return order;
}