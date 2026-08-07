import { Prisma } from "@prisma/client";
import { ApiError } from "../ApiError";
import { ORDER_MESSAGE } from "../../types/order.types";

export const updateInventory = async (
    tx: Prisma.TransactionClient,
    items: any[]
) => {
    for (const item of items) {
        const result =
            await tx.productVariant.updateMany({
                where: {
                    id: item.variantId,
                    stock: {
                        gte: item.quantity,
                    },
                },
                data: {
                    stock: {
                        decrement: item.quantity,
                    },
                },
            });

        if (result.count !== 1) {
            throw new ApiError(
                409,
                `${ORDER_MESSAGE.INSUFFICIENT_STOCK}: ${item.product.name}`
            );
        }
    }
};