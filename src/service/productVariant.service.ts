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


export const getProductVariantsService = async (productId: string) => {
    const product = await prisma.product.findUnique({
        where: {
            id: productId,
            deletedAt: null,
        },
        select: {
            id: true,
        },
    });

    if (!product) {
        throw new ApiError(404, PRODUCT_MESSAGE.NOT_FOUND);
    }

    const variants = await prisma.productVariant.findMany({
        where: {
            productId,
            deletedAt: null,
            isActive: true,
        },

        orderBy: {
            createdAt: "asc",
        },
    });

    return variants;
};


export const getVariantByIdService = async (variantId: string) => {

    const variant = await prisma.productVariant.findFirst({

        where: {
            id: variantId,
            deletedAt: null,
            isActive: true,
        },

        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                },
            },
        },
    });

    if (!variant) {
        throw new ApiError(
            404,
            PRODUCT_MESSAGE.VARIENT_NOT_FOUND
        );
    }

    return variant;
};

export const updateVariantService = async (
    variantId: string,
    data: Partial<createVariantDto>
) => {

    const variant = await prisma.productVariant.findUnique({
        where: {
            id: variantId,
        },
    });

    if (!variant || variant.deletedAt) {
        throw new ApiError(404, PRODUCT_MESSAGE.VARIENT_NOT_FOUND);
    }

    if (data.sku) {
        const exists = await prisma.productVariant.findFirst({
            where: {
                sku: data.sku,
                NOT: {
                    id: variantId,
                },
            },
        });

        if (exists) {
            throw new ApiError(409, PRODUCT_MESSAGE.SKU_EXISTS);
        }
    }

    return prisma.productVariant.update({
        where: {
            id: variantId,
        },
        data,
    });
};

export const deleteVariantService = async (
    variantId: string
) => {

    const variant = await prisma.productVariant.findUnique({
        where: {
            id: variantId,
        },
    });

    if (!variant || variant.deletedAt) {
        throw new ApiError(
            404,
            PRODUCT_MESSAGE.VARIENT_NOT_FOUND
        );
    }

    await prisma.productVariant.update({
        where: {
            id: variantId,
        },
        data: {
            deletedAt: new Date(),
            isActive: false,
        },
    });
};
