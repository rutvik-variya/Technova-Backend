import { Prisma } from "@prisma/client";
import { ApiError } from "../ApiError";
import { WISHLIST_MESSAGE } from "../../types/wishlist.type";

export const getWishlistItem = async (
    db:
        | Prisma.TransactionClient
        | Prisma.DefaultPrismaClient,
    userId: string,
    productId: string
) => {
    const wishlistItem =
        await db.wishlist.findUnique({
            where: {
                wishlist_user_product_unique: {
                    userId,
                    productId,
                },
            },
            select: {
                id: true,
                productId: true,

                product: {
                    select: {
                        productVariants: {
                            where: {
                                isActive: true,
                                deletedAt: null,
                            },
                            orderBy: {
                                createdAt: "asc",
                            },
                            take: 1,
                            select: {
                                id: true,
                            },
                        },
                    },
                },
            },
        });

    if (!wishlistItem) {
        throw new ApiError(
            404,
            WISHLIST_MESSAGE.ITEM_NOT_FOUND
        );
    }

    return wishlistItem;
};