import { Prisma } from "@prisma/client";
import { ApiError } from "../ApiError";
import { CART_MESSAGE } from "../../types/cart.types";

export const validateProduct = async (
    tx: Prisma.TransactionClient,
    productId: string,
    variantId: string
) => {
    const product = await tx.product.findUnique({
        where: {
            id: productId
        },
        include: {
            productVariants: true
        }
    })
    if (!product) {
        throw new ApiError(404, CART_MESSAGE.PRODUCT_NOT_FOUND);
    }

    let variant = null;
    if (variantId) {
        variant = await product.productVariants.find((item) => item.id === variantId) ?? null;
    }

    if (!variant) {
        throw new ApiError(404, CART_MESSAGE.VARIANT_NOT_FOUND);
    }

    return {
        product,
        variant
    }
}