import prisma from "../lib/prisma";

export const updateProductPrice = async (productId: string) => {
    const prices = await prisma.productVariant.aggregate({
        where: {
            productId,
            deletedAt: null,
            isActive: true,
        },
        _min: {
            price: true,
        },
        _max: {
            price: true,
        },
    });

    await prisma.product.update({
        where: {
            id: productId,
        },
        data: {
            basePrice: prices._min.price ?? 0,
            maxPrice: prices._max.price ?? 0,
        },
    });
};