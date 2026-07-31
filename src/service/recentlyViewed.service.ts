import prisma from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { productSelect } from "../constants/prismaSelect";
import { PRODUCT_MESSAGE } from "../types/product.types";

export const addRecentlyViewedService = async (
    userId: string,
    productId: string
) => {

    const product = await prisma.product.findFirst({
        where: {
            id: productId,
            deletedAt: null,
            status: "ACTIVE",
        },
        select: {
            id: true,
        },
    });

    if (!product) {
        throw new ApiError(404, PRODUCT_MESSAGE.NOT_FOUND);
    }

    await prisma.recentlyViewed.upsert({
        where: {
            userId_productId: {
                userId,
                productId,
            },
        },
        update: {
            viewedAt: new Date(),
        },
        create: {
            userId,
            productId,
        },
    });

    return;
};

export const getRecentlyViewedService = async (
    userId: string
) => {
    const products = await prisma.recentlyViewed.findMany({
        where: {
            userId,
        },
        orderBy: {
            viewedAt: "desc",
        },
        take: 20,
        select: {
            viewedAt: true,
            product: {
                select: productSelect,
            },
        },
    });
    return products;
};

