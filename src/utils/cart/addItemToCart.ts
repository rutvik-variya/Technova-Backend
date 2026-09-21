import { Prisma } from "@prisma/client";

import {
    AddToCartDto,
    CART_MESSAGE,
} from "../../types/cart.types";

import { getOrCreateCart } from "./getOrCreateCart";
import { validateProduct } from "./validateProduct";
import { validateStock } from "./validateStock";
import { ApiError } from "../ApiError";

export const addItemToCart = async (
    tx: Prisma.TransactionClient,
    userId: string,
    payload: AddToCartDto
) => {
    const {
        productId,
        variantId,
        quantity,
    } = payload;

    // 1. Get cart
    const cart = await getOrCreateCart(
        tx,
        userId,
    );

    // 2. Validate requested variant
    const { variant } = await validateProduct(
        tx,
        productId,
        variantId
    );

    // 3. Find existing cart item
    const existingItem =
        await tx.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId,
                variantId,
            },
            select: {
                id: true,
                quantity: true,
            },
        });

    const currentQuantity =
        existingItem?.quantity ?? 0;

    const finalQuantity =
        currentQuantity + quantity;

    // 4. Validate stock
    validateStock(
        variant.stock,
        finalQuantity
    );

    // 5. Add/update cart item
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
                priceAtAdded: variant.price,
            },
        });
    }

    // 6. Update cart totals incrementally
    const subtotalIncrease =
        Number(variant.price) * quantity;

    await tx.cart.update({
        where: {
            id: cart.id,
        },
        data: {
            subtotal: {
                increment: subtotalIncrease,
            },
            totalItem: {
                increment: quantity,
            },
        },
    });

    return {
        cartId: cart.id,
    };
};