import prisma from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { createVariantDto, PRODUCT_MESSAGE } from "../types/product.types";

export const createVariantService = async (
    productId: string,
    data: createVariantDto
) => {
    const product = await prisma.product.findUnique({
        where: {
            id: productId,
        },
        select: {
            id: true,
        },
    });

    if (!product) {
        throw new ApiError(404, PRODUCT_MESSAGE.NOT_FOUND);
    }

    const skuExists = await prisma.productVariant.findUnique({
        where: {
            sku: data.sku,
        },
    });

    if (skuExists) {
        throw new ApiError(409, PRODUCT_MESSAGE.SKU_EXISTS);
    }

    const variant = await prisma.productVariant.create({
        data: {
            productId: productId,
            sku: data.sku,
            ram: data.ram,
            storage: data.storage,
            color: data.color,
            price: data.price,
            comparePrice: data.comparePrice,
            stock: data.stock,
        },
    });

    return variant;
};