import { Prisma } from "@prisma/client";
import { ApiError } from "../ApiError";
import { CART_MESSAGE } from "../../types/cart.types";

export const validateProduct = async (
    tx: Prisma.TransactionClient,
    productId: string,
    variantId: string
) => {
    const variant = await tx.productVariant.findFirst({
        where: {
            id: variantId,
            productId,
            isActive: true,
            deletedAt: null,
        },
        select: {
            id: true,
            productId: true,
            price: true,
            stock: true,
        },
    });

    if (!variant) {
        throw new ApiError(
            404,
            CART_MESSAGE.VARIANT_NOT_FOUND
        );
    }

    return {
        variant,
    };
};