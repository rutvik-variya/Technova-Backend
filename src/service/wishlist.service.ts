import { includes } from "zod";
import prisma from "../lib/prisma";
import { AddWishlistDto, WISHLIST_MESSAGE } from "../types/wishlist.type";
import { ApiError } from "../utils/ApiError";
import { addItemToCart } from "../utils/cart/addItemToCart";
import { getWishlist } from "../utils/wishlist/getWishlist";
import { getWishlistItem } from "../utils/wishlist/getWishlistItem";
import { wishlistResponse } from "../utils/wishlist/wishlistResponse";
import { logger } from "../utils/logger";


export const addWishlistService = async (
    userId: string,
    payload: AddWishlistDto
) => {
    const { productId } = payload;
    const product = await prisma.product.findUnique({
        where: {
            id: productId
        }
    })
    if (!product) {
        throw new ApiError(404, WISHLIST_MESSAGE.PRODUCT_NOT_FOUND);
    }

    const existing = await prisma.wishlist.findUnique({
        where: {
            wishlist_user_product_unique: {
                userId,
                productId
            }
        }
    })

    if (existing) {
        throw new ApiError(409, WISHLIST_MESSAGE.ALREADY_EXISTS);
    }

    return await prisma.wishlist.create({
        data: {
            userId,
            productId
        },
        include: {
            product: true
        }
    })
}


export const getWishlistService = async (
    userId: string
) => {
    const wishlist = await getWishlist(
        prisma,
        userId
    );

    return wishlistResponse(wishlist);
};


export const removeWishlistService = async (
    userId: string,
    productId: string
) => {
    return prisma.$transaction(async (tx) => {
        const wishlistItem = await getWishlistItem(
            tx,
            userId,
            productId
        );

        if (!wishlistItem) {
            throw new ApiError(404, WISHLIST_MESSAGE.ITEM_NOT_FOUND);
        }

        await tx.wishlist.delete({
            where: {
                id: wishlistItem.id,
            },
        });

        return null;
    });
};

export const moveWishlistToCartService = async (
    userId: string,
    productId: string
) => {
    return prisma.$transaction(
    async (tx) => {
        const wishlistItem = await getWishlistItem(
            tx,
            userId,
            productId
        );

        if (!wishlistItem) {
            throw new ApiError(
                404,
                WISHLIST_MESSAGE.ITEM_NOT_FOUND
            );
        }

        const cart = await addItemToCart(tx, userId, {
            productId,
            variantId: wishlistItem.product.productVariants[0].id,
            quantity: 1
        });

        await tx.wishlist.delete({
            where: {
                id: wishlistItem.id,
            },
        });

        return cart;
    },
    {
        timeout: 50000, 
    }
);
};


export const clearWishlistService = async (
    userId: string
) => {
    await prisma.wishlist.deleteMany({
        where: {
            userId,
        },
    });

    return;
};

