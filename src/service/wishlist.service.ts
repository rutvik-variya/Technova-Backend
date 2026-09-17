import prisma from "../lib/prisma";
import { AddWishlistDto, WISHLIST_MESSAGE } from "../types/wishlist.type";
import { ApiError } from "../utils/ApiError";
import { addItemToCart } from "../utils/cart/addItemToCart";
import { getWishlist } from "../utils/wishlist/getWishlist";
import { getWishlistItem } from "../utils/wishlist/getWishlistItem";
import { wishlistResponse } from "../utils/wishlist/wishlistResponse";

export const addWishlistService = async (
    userId: string,
    payload: AddWishlistDto
) => {
    const { productId } = payload;

    const existing = await prisma.wishlist.findUnique({
        where: {
            wishlist_user_product_unique: {
                userId,
                productId,
            },
        },
        select: {
            id: true,
        },
    });


    if (existing) {
        throw new ApiError(409, WISHLIST_MESSAGE.ALREADY_EXISTS);
    }

    return await prisma.wishlist.create({
        data: {
            userId,
            productId
        },

        select: {
            product: {
                select: {
                    id: true
                },
            },
        },

    })
}

export const syncWishlistService = async (
    userId: string,
    productIds: string[]
) => {
    if (!productIds.length) {
        return {
            added: 0,
        };
    }

    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds,
            },
            status: "ACTIVE",
        },
        select: {
            id: true,
        },
    });

    if (!products.length) {
        return {
            added: 0,
        };
    }

    const validProductIds = products.map(
        (product) => product.id
    );

    const result = await prisma.wishlist.createMany({
        data: validProductIds.map((productId) => ({
            userId,
            productId,
        })),
        skipDuplicates: true,
    });

    return {
        added: result.count,
    };
};

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
    const wishlistItem = await getWishlistItem(
        prisma,
        userId,
        productId
    );

    await prisma.wishlist.delete({
        where: {
            id: wishlistItem.id,
        },
    });

    return null;
};

export const moveWishlistToCartService = async (
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

        const cart = await addItemToCart(tx, userId, {
            productId,
            variantId: wishlistItem.product.productVariants[0]?.id,
            quantity: 1
        });

        await tx.wishlist.delete({
            where: {
                id: wishlistItem.id,
            },
        });

        return cart;
    },
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

