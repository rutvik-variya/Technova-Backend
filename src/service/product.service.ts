import prisma from "../lib/prisma";
import { createProductDto, PRODUCT_MESSAGE, updateProductDto } from "../types/product.types";
import slugify from "../utils/slugify"
import { ApiError } from "../utils/ApiError";
import { pagination } from "../utils/pagination";
import { productSelect } from "../constants/prismaSelect";
import { queryBuilder } from "../utils/queryBuilder";

export const createProductService = async (data: createProductDto) => {
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

    const qb = queryBuilder({
        query,
        searchableFields: [
            "name",
            "brand",
            "description",
            "shortDescription"
        ]
    })

    const where = {
        deletedAt: null,
        status: "ACTIVE" as const,
        ...qb.where
    }

    const [products, total] = await prisma.$transaction([
        prisma.product.findMany({
            where,
            skip: qb.skip,
            take: qb.take,
            orderBy: qb.orderBy,
            select: productSelect,
        }),
        prisma.product.count({
            where,
        })
    ])

    return {
        products,
        pagination: pagination({
            page: qb.page,
            limit: qb.limit,
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


// isFeautured

export const getFeaturedProductsService = async () => {
    const products = await prisma.product.findMany({
        where: {
            deletedAt: null,
            isFeatured: true,
            status: "ACTIVE"
        },
        orderBy: {
            createdAt: "desc",
        },
        select: productSelect
    })
    return products;
}

export const updateFeaturedStatusService = async (
    id: string,
    data: updateProductDto
) => {
    const product = await prisma.product.findFirst({
        where: {
            id,
            deletedAt: null
        }
    })

    if (!product) {
        throw new ApiError(404, PRODUCT_MESSAGE.NOT_FOUND);
    }

    return prisma.product.update({
        where: {
            id,
        },
        data: {
            isFeatured: data.isFeatured
        },
        select: productSelect
    })
}


export const getRelatedProductsService = async (
    slug: string
) => {
    const product =
        await prisma.product.findFirst({
            where: {
                slug,
                deletedAt: null,
                status: "ACTIVE",
            },
            select: {
                id: true,
                categoryId: true,
                brand: true,
            },
        });

    if (!product) {
        throw new ApiError(404, PRODUCT_MESSAGE.NOT_FOUND);
    }

    const relatedProducts =
        await prisma.product.findMany({
            where: {
                deletedAt: null,
                status: "ACTIVE",
                id: {
                    not: product.id,
                },
                OR: [
                    {
                        brand: product.brand,
                    },
                    {
                        categoryId:
                            product.categoryId,
                    },
                ],
            },
            take: 8,
            orderBy: {
                createdAt: "desc",
            },
            select: productSelect,
        });
    return relatedProducts;
};