import { Prisma } from "@prisma/client";

export const getWishlist = async (
    tx: Prisma.TransactionClient | Prisma.DefaultPrismaClient,
    userId: string
) => {
    return tx.wishlist.findMany({
        where: { userId },
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            createdAt: true,

            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    brand: true,
                    basePrice: true,
                    maxPrice: true,
                    status: true,
                    category: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
    });
};