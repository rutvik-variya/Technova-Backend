import prisma from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { CART_MESSAGE, AddToCartDto, UpdateCartItemDto } from "../types/cart.types";
import { getOrCreateCart } from "../utils/cart/getOrCreateCart";
import { validateProduct } from "../utils/cart/validateProduct";
import { validateStock } from "../utils/cart/validateStock";
import { updateCartTotals } from "../utils/cart/updateCartTotals";
import { getCart } from "../utils/cart/getCart";
import { addItemToCart } from "../utils/cart/addItemToCart";

export const addtocartService = async (
    userId: string,
    payload: AddToCartDto
) => {
    return prisma.$transaction((tx) =>
        addItemToCart(
            tx,
            userId,
            payload
        )
    );
};

export const getUserCartService = async (
    userId: string
) => {
    const cart = await getOrCreateCart(
        prisma,
        userId
    );

    return getCart(cart.id);
};

export const updateCartItemService = async (
    userId: string,
    itemId: string,
    payload: UpdateCartItemDto
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

                variant: {
                    select: {
                        stock: true,
                    },
                },

                product: {
                    select: {
                        productVariants: {
                            where: {
                                isActive: true,
                                deletedAt: null,
                            },
                            select: {
                                stock: true,
                            },
                            take: 1,
                        },
                    },
                },
            },
        });

        if (!cartItem) {
            throw new ApiError(
                404,
                CART_MESSAGE.CART_ITEM_NOT_FOUND
            );
        }

        const stock =
            cartItem.variant?.stock ??
            cartItem.product.productVariants[0]?.stock ??
            0;

        validateStock(
            stock,
            payload.quantity
        );

        await tx.cartItem.update({
            where: {
                id: cartItem.id,
            },
            data: {
                quantity: payload.quantity,
            },
        });

        await updateCartTotals(
            tx,
            cartItem.cartId
        );

        return {
            cartId: cartItem.cartId,
            itemId: cartItem.id,
            quantity: payload.quantity,
        };
    });
};


export const removeCartItemService = async (
    userId: string,
    itemId: string
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
            },
        });

        if (!cartItem) {
            throw new ApiError(
                404,
                CART_MESSAGE.CART_ITEM_NOT_FOUND
            );
        }

        await tx.cartItem.delete({
            where: {
                id: cartItem.id,
            },
        });

        await updateCartTotals(
            tx,
            cartItem.cartId
        );

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
                subtotal: 0,
                totalItem: 0,
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
            subtotal: 0,
            totalItem: 0,
            cartItems: [],
        };
    });
};
