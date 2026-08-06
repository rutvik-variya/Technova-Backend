import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma";
import { ApiError } from "../ApiError";
import { WISHLIST_MESSAGE } from "../../types/wishlist.type";

export const getWishlistItem = async(
    userId: string,
    productId: string
) => {
    const wishlistItem = await prisma.wishlist.findUnique({
        where: {
            wishlist_user_product_unique: {
                userId,
                productId,
            },
        },
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    productVariants: {
                        select: {
                            id: true
                        }
                    }
                }
            }
        }
    });

    if (!wishlistItem) {
        throw new ApiError(404, WISHLIST_MESSAGE.ITEM_NOT_FOUND);
    }

    return wishlistItem;
};