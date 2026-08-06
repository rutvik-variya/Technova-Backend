import { Prisma } from "@prisma/client";

import { AddToCartDto, CART_MESSAGE } from "../../types/cart.types";
import { getOrCreateCart } from "./getOrCreateCart";
import { validateProduct } from "./validateProduct";
import { validateStock } from "./validateStock";
import { updateCartTotals } from "./updateCartTotals";
import { getCart } from "./getCart";
import { ApiError } from "../ApiError";

export const addItemToCart = async (
    tx: Prisma.TransactionClient,
    userId: string,
    payload: AddToCartDto
) => {
    const { productId, variantId, quantity } = payload;

    const cart = await getOrCreateCart(tx, userId);

    if (!cart) {
        throw new ApiError(500, CART_MESSAGE.FAILED_CREATE_CART);
    }

    const { product, variant } = await validateProduct(
        tx,
        productId,
        variantId
    );

    const existingItem = await tx.cartItem.findFirst({
        where: {
            cartId: cart.id,
            productId,
            variantId: variantId ?? null,
        },
    });

    const finalQuantity = (existingItem?.quantity ?? 0) + quantity;

    validateStock(variant.stock, finalQuantity);

    if (existingItem) {
        await tx.cartItem.update({
            where: {
                id: existingItem.id,
            },
            data: {
                quantity: finalQuantity,
            },
        });
    } else {
        await tx.cartItem.create({
            data: {
                cartId: cart.id,
                productId,
                variantId,
                quantity,
                priceAtAdded: variant.price
            },
        });
    }

    await updateCartTotals(tx, cart.id);

    return cart.id;
};