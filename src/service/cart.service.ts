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
        addItemToCart(tx, userId, payload)
    );
}

export const getUserCartService = async (userId: string) => {
    return prisma.$transaction(async (tx) => {
        const cart = await getOrCreateCart(tx, userId);
        return getCart(tx, cart.id)
    })
}

export const updateCartItemService = async (
    userId: string,
    itemId: string,
    payload: UpdateCartItemDto
) => {
    return prisma.$transaction(async (tx) => {
        const cart = await tx.cart.findUnique({
            where: {
                userId,
            },
        });

        if (!cart) {
            throw new ApiError(404, CART_MESSAGE.CART_NOT_FOUND);
        }

        const cartItem = await tx.cartItem.findFirst({
            where: {
                id: itemId,
            },
            include: {
                product: {
                    include: {
                        productVariants: true
                    }
                },
                variant: true
            }
        })

        if (!cartItem || cartItem.cartId !== cart.id) {
            throw new ApiError(404, CART_MESSAGE.CART_ITEM_NOT_FOUND);
        }

        const stock = cartItem.variant?.stock ?? cartItem.product.productVariants?.[0]?.stock;
        validateStock(stock ?? 0, payload.quantity);

        await tx.cartItem.update({
            where: {
                id: itemId
            },
            data: {
                quantity: payload.quantity
            }
        })

        await updateCartTotals(tx, cart.id);
        return getCart(tx, cart.id)
    })
}


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
        });

        if (!cartItem) {
            throw new ApiError(404, CART_MESSAGE.CART_ITEM_NOT_FOUND);
        }

        await tx.cartItem.delete({
            where: {
                id: cartItem.id,
            },
        });

        await updateCartTotals(tx, cartItem.cartId);
        return getCart(tx, cartItem.cartId);
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

        return getCart(tx, cart.id);
    });
};

