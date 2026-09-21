import { Prisma } from "@prisma/client";
import { ApiError } from "../ApiError";
import { CART_MESSAGE } from "../../types/cart.types";
import { validateStock } from "./validateStock";
import type { SyncCartItemDto } from "../../types/cart.types";

export const syncCartItems = async (
    tx: Prisma.TransactionClient,
    userId: string,
    items: SyncCartItemDto[],
) => {
    const cart = await tx.cart.upsert({
        where: {
            userId,
        },

        update: {},

        create: {
            userId,
        },

        select: {
            id: true,
        },
    });

    if (!items.length) {
        return cart;
    }

    const variantIds = [
        ...new Set(
            items.map((item) => item.variantId),
        ),
    ];

    const variants =
        await tx.productVariant.findMany({
            where: {
                id: {
                    in: variantIds,
                },

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

    const variantMap = new Map(
        variants.map((variant) => [
            variant.id,
            variant,
        ]),
    );

    const existingItems =
        await tx.cartItem.findMany({
            where: {
                cartId: cart.id,
            },

            select: {
                id: true,
                productId: true,
                variantId: true,
                quantity: true,
                priceAtAdded: true,
            },
        });

    const existingMap = new Map(
        existingItems.map((item) => [
            `${item.productId}:${item.variantId}`,
            item,
        ]),
    );

    let subtotalIncrement = 0;
    let totalItemIncrement = 0;

    for (const item of items) {
        const variant = variantMap.get(
            item.variantId,
        );

        if (!variant) {
            throw new ApiError(
                404,
                CART_MESSAGE.VARIANT_NOT_FOUND,
            );
        }

        if (variant.productId !== item.productId) {
            throw new ApiError(
                400,
                CART_MESSAGE.VARIANT_NOT_FOUND,
            );
        }

        const key =
            `${item.productId}:${item.variantId}`;

        const existingItem =
            existingMap.get(key);

        const currentQuantity =
            existingItem?.quantity ?? 0;

        const finalQuantity =
            currentQuantity + item.quantity;

        validateStock(
            variant.stock,
            finalQuantity,
        );

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
                    productId: item.productId,
                    variantId: item.variantId,
                    quantity: item.quantity,
                    priceAtAdded: variant.price,
                },
            });
        }

        subtotalIncrement +=
            Number(variant.price) *
            item.quantity;

        totalItemIncrement +=
            item.quantity;
    }

    await tx.cart.update({
        where: {
            id: cart.id,
        },

        data: {
            subtotal: {
                increment: subtotalIncrement,
            },

            totalItem: {
                increment: totalItemIncrement,
            },
        },
    });

    return cart;
};