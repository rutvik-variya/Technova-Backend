import { Prisma } from "@prisma/client";

export const getWishlist = async (
    tx: Prisma.TransactionClient | Prisma.DefaultPrismaClient,
    userId: string
) => {
    return tx.wishlist.findMany({
        where: {
            userId,
        },
        include: {
            product: {
                include: {
                    category: true,
                    productVariants: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};