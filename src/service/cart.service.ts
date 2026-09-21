import prisma from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import {
    CART_MESSAGE,
    AddToCartDto,
    UpdateCartItemDto,
    SyncCartDto,
} from "../types/cart.types";
import { validateStock } from "../utils/cart/validateStock";
import { updateCartTotals } from "../utils/cart/updateCartTotals";
import { addItemToCart } from "../utils/cart/addItemToCart";
import { getCartByUserId } from "../utils/cart/getCartByUserId";
import { syncCartItems } from "../utils/cart/syncCart";
import { getCart } from "../utils/cart/getCart";

export const addtocartService = async (
    userId: string,
    payload: AddToCartDto
) => {
    return prisma.$transaction((tx) =>
        addItemToCart(tx, userId, payload)
    );
};


export const getUserCartService = async (
    userId: string,
) => {
    return getCartByUserId(userId);
};

export const updateCartItemService = async (
    userId: string,
    itemId: string,
    payload: UpdateCartItemDto,
) => {
    return prisma.$transaction(async (tx) => {
        const cartItem = await tx.cartItem.findFirst({
            where: {
                id: itemId,
                cart: {
                    userId,
                },
            },

            select: {
                id: true,
                cartId: true,
                quantity: true,
                priceAtAdded: true,

                variant: {
                    select: {
                        stock: true,
                    },
                },
            },
        });

        if (!cartItem) {
            throw new ApiError(
                404,
                CART_MESSAGE.CART_ITEM_NOT_FOUND,
            );
        }

        const stock = cartItem.variant?.stock ?? 0;

        validateStock(
            stock,
            payload.quantity,
        );

        const quantityDifference =
            payload.quantity - cartItem.quantity;

        const subtotalDifference =
            Number(cartItem.priceAtAdded) *
            quantityDifference;

        await tx.cartItem.update({
            where: {
                id: cartItem.id,
            },

            data: {
                quantity: payload.quantity,
            },
        });

        await tx.cart.update({
            where: {
                id: cartItem.cartId,
            },

            data: {
                subtotal: {
                    increment: subtotalDifference,
                },

                totalItem: {
                    increment: quantityDifference,
                },
            },
        });

        return {
            cartId: cartItem.cartId,
            itemId: cartItem.id,
            quantity: payload.quantity,
        };
    });
};


export const removeCartItemService = async (
    userId: string,
    itemId: string,
) => {
    return prisma.$transaction(async (tx) => {
        const cartItem = await tx.cartItem.findFirst({
            where: {
                id: itemId,
                cart: {
                    userId,
                },
            },

            select: {
                id: true,
                cartId: true,
                quantity: true,
                priceAtAdded: true,
            },
        });

        if (!cartItem) {
            throw new ApiError(
                404,
                CART_MESSAGE.CART_ITEM_NOT_FOUND,
            );
        }

        const subtotalDecrease =
            Number(cartItem.priceAtAdded) *
            cartItem.quantity;

        await tx.cartItem.delete({
            where: {
                id: cartItem.id,
            },
        });

        await tx.cart.update({
            where: {
                id: cartItem.cartId,
            },

            data: {
                subtotal: {
                    decrement: subtotalDecrease,
                },

                totalItem: {
                    decrement: cartItem.quantity,
                },
            },
        });

        return {
            cartId: cartItem.cartId,
            itemId: cartItem.id,
        };
    });
};

export const clearCartService = async (
    userId: string
) => {
    return prisma.$transaction(async (tx) => {

        const cart = await tx.cart.findUnique({
            where: {
                userId,
            },
            select: {
                id: true,
            },
        });

        if (!cart) {
            return {
                id: null,
                userId,
                subtotal: "0",
                totalItem: 0,
                couponId: null,
                cartItems: [],
            };
        }

        await tx.cartItem.deleteMany({
            where: {
                cartId: cart.id,
            },
        });

        await tx.cart.update({
            where: {
                id: cart.id,
            },
            data: {
                subtotal: 0,
                totalItem: 0,
            },
        });

        return {
            id: cart.id,
            userId,
            subtotal: "0",
            totalItem: 0,
            couponId: null,
            cartItems: [],
        };
    });
};


export const syncCartService = async (
    userId: string,
    payload: SyncCartDto,
) => {
    const cart = await prisma.$transaction(
        async (tx) => {
            return syncCartItems(
                tx,
                userId,
                payload.items,
            );
        },
    );

    return getCart(
        prisma,
        cart.id,
    );
};
