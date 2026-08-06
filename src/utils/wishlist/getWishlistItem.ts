import { Prisma } from "@prisma/client";

export const getWishlistItem = (
    tx: Prisma.TransactionClient,
    userId: string,
    productId: string
) => {
    return tx.wishlist.findUnique({
        where: {
            wishlist_user_product_unique: {
                userId,
                productId,
            },
        },
        include: {
            product: {
                include: {
                    productVariants: true
                }
            }
        }
    });
};