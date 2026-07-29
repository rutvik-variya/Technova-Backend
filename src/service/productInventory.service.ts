import prisma from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { PRODUCT_MESSAGE } from "../types/product.types";
import { AdjustInventoryDto } from "../types/inventory.types";

export const getInventoryService = async (variantId: string) => {
    const inventory = await prisma.inventory.findUnique({
        where: {
            variantId,
        },
        include: {
            variant: {
                select: {
                    id: true,
                    sku: true,
                },
            },
        },
    });

    if (!inventory) {
        throw new ApiError(404, PRODUCT_MESSAGE.INVENTORY_NOT_FOUND);
    }
};

export const updateInventoryService = async (
    variantId: string,
    data: {
        quantity: number;
        lowStock: number;
    },
) => {
    return prisma.inventory.upsert({
        where: {
            variantId,
        },
        create: {
            variantId,
            quantity: data.quantity,
            lowStock: data.lowStock,
        },
        update: {
            quantity: data.quantity,
            lowStock: data.lowStock,
        },
    });
};



export const adjustInventoryService = async (
    variantId: string,
    data: AdjustInventoryDto
) => {

    const inventory = await prisma.inventory.findUnique({
        where: {
            variantId,
        },
    });

    if (!inventory) {
        throw new ApiError(404, PRODUCT_MESSAGE.INVENTORY_NOT_FOUND);
    }

    let quantity = inventory.quantity;

    if (data.type === "IN") {
        quantity += data.quantity;
    } else {
        if (inventory.quantity < data.quantity) {
            throw new ApiError(400, PRODUCT_MESSAGE.INSUFFICIENT_INVENTORY);
        }
        quantity -= data.quantity;
    }

    return prisma.inventory.update({
        where: {
            variantId,
        },
        data: {
            quantity,
        },
    });
};

export const getLowStockProductsService = async () => {
    const inventory = await prisma.inventory.findMany({
        include: {
            variant: {
                select: {
                    id: true,
                    sku: true,
                    product: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                },
            },
        },
    });


    return inventory.filter(
        (item) => item.quantity <= item.lowStock
    );
};

export const getOutOfStockProductsService = async () => {
    return prisma.inventory.findMany({
        where: {
            quantity: 0,
        },
        include: {
            variant: {
                select: {
                    id: true,
                    sku: true,
                    product: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            updatedAt: "desc",
        },
    });
};


