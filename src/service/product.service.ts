import prisma from "../lib/prisma";
import { createProdutDto, PRODUCT_MESSAGE, updateProductDto } from "../types/product.types";
import slugify from "../utils/slugify"
import { ApiError } from "../utils/ApiError";
import { pagination } from "../utils/pagination";
import { productSelect } from "../constants/prismaSelect";

export const createProductService = async (data: createProdutDto) => {
    const category = await prisma.category.findUnique({
        where: {
            id: data.categoryId,
        },
        select: {
            id: true,
        },
    });
    if (!category) {
        throw new ApiError(404, PRODUCT_MESSAGE.CATEGORY_NOT_FOUND);
    }

    const slug = slugify(data.name);
    const existingProduct = await prisma.product.findUnique({
        where: {
            slug,
        }
    })
    if (existingProduct) {
        throw new ApiError(409, PRODUCT_MESSAGE.ALREADY_EXISTS)
    }
    const product = await prisma.product.create({
        data: {
            name: data.name,
            slug,
            description: data.description,
            shortDescription: data.shortDescription,
            brand: data.brand,
            status: data.status ?? "DRAFT",
            isFeatured: data.isFeatured ?? false,
            categoryId: data.categoryId
        }
    })

    return product;
}

export const getProductSevice = async (query: any) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where = {
        deletedAt: null,
        status: "ACTIVE" as const,
    }

    const [products, total] = await prisma.$transaction([
        prisma.product.findMany({
            where,
            select: productSelect,
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc"
            }
        }),
        prisma.product.count({
            where,
        })
    ])

    return {
        products,
        pagination: pagination({
            page,
            limit,
            total,
        }),
    };
}

export const getProductBySlugService = async (slug: string) => {
    const product = await prisma.product.findFirst({
        where: {
            slug,
            deletedAt: null,
            status: "ACTIVE"
        },
        select: productSelect
    })

    if (!product) {
        throw new ApiError(404, PRODUCT_MESSAGE.NOT_FOUND)
    }
    return product
}



export const updateProductService = async (id: string, data: updateProductDto) => {
    const existingProduct = await prisma.product.findUnique({
        where: {
            id,
        },
    });

    if (!existingProduct || existingProduct.deletedAt) {
        throw new ApiError(404, PRODUCT_MESSAGE.NOT_FOUND);
    }
    let slug = existingProduct.slug;

    if (data.name && data.name !== existingProduct.name) {

        slug = slugify(data.name);

        const duplicate = await prisma.product.findFirst({
            where: {
                slug,
                NOT: {
                    id,
                },
            },
        });

        if (duplicate) {
            throw new ApiError(409, PRODUCT_MESSAGE.ALREADY_EXISTS);
        }
    }

    if (data.categoryId) {
        const category = await prisma.category.findUnique({
            where: {
                id: data.categoryId,
            },
            select: {
                id: true,
            },
        });

        if (!category) {
            throw new ApiError(
                404,
                PRODUCT_MESSAGE.CATEGORY_NOT_FOUND
            );
        }
    }

    const product = await prisma.product.update({
        where: {
            id,
        },
        data: {
            ...data,
            slug,
        },
        select: productSelect
    });

    return product;
}

export const deleteProductService = async (id: string) => {
    const product = await prisma.product.findUnique({
        where: {
            id,
        },
    });

    if (!product || product.deletedAt) {
        throw new ApiError(404, PRODUCT_MESSAGE.NOT_FOUND);
    }

    await prisma.product.update({
        where: {
            id,
        },
        data: {
            deletedAt: new Date(),
        },
    });
}