import prisma from "../lib/prisma";
import { CreateCategoryDto } from "../types/category.types";
import slugify from "../utils/slugify";
import { CATEGORY_MESSAGE } from "../constants/category";
import { ApiError } from "../utils/ApiError";
import { categorySelect } from "../constants/prismaSelect";

const createCategoryService = async (data: CreateCategoryDto) => {
    const name = data.name.trim();
    const slug = slugify(name);

    const existingCategory = await prisma.category.findFirst({
        where: {
            OR: [
                {
                    name: {
                        equals: name,
                        mode: "insensitive",
                    },
                },
                {
                    slug,
                },
            ]
        }
    })

    if (existingCategory) {
        throw new ApiError(409, CATEGORY_MESSAGE.ALREADY_EXISTS)
    }

    const category = await prisma.category.create({
        data: {
            name,
            slug,
            description: data.description,
            image: data.image
        }
    })

    return category
}

const getCategoriesService = async () => {
    return await prisma.category.findMany({
        orderBy: {
            createdAt: "desc",
        },
        select: categorySelect
    });
};

const getCategoryByIdService = async (id: string) => {

    const category = await prisma.category.findUnique({
        where: {
            id,
        },
        select: categorySelect
    });

    if (!category) {
        throw new ApiError(404, CATEGORY_MESSAGE.NOT_FOUND);
    }
    return category;
};


const updateCategoryService = async (id: string, data: Partial<CreateCategoryDto>) => {
    const category = await prisma.category.findUnique({
        where: {
            id
        }
    })

    if (!category) {
        throw new ApiError(404, CATEGORY_MESSAGE.NOT_FOUND)
    }

    const updateData: Record<string, any> = {};
    if (data.name) {
        const name = data.name.trim();

        const slug = slugify(name);

        const duplicate = await prisma.category.findFirst({
            where: {
                id: {
                    not: id,
                },
                OR: [
                    {
                        name: {
                            equals: name,
                            mode: "insensitive",
                        },
                    },
                    {
                        slug,
                    },
                ],
            },
        });

        if (duplicate) {
            throw new ApiError(409, CATEGORY_MESSAGE.ALREADY_EXISTS);
        }
        updateData.name = name;
        updateData.slug = slug;
    }

    if (data.description !== undefined) {
        updateData.description = data.description;
    }
    if (data.image !== undefined) {
        updateData.image = data.image;
    }
    return await prisma.category.update({
        where: {
            id,
        },
        data: updateData,

        select: categorySelect
    });

}

const deleteCategoryService = async (id: string) => {
    const category = await prisma.category.findUnique({
        where: {
            id,
        },
    });

    if (!category) {
        throw new ApiError(404, CATEGORY_MESSAGE.NOT_FOUND);
    }

    // TODO:
    // Check if category contains products
    // after Product module implementation

    await prisma.category.delete({
        where: {
            id,
        }
    })
    return;
}

export { createCategoryService, getCategoriesService, getCategoryByIdService, updateCategoryService, deleteCategoryService }
