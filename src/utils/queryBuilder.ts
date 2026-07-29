interface QueryBuiderOptions {
    query: Record<string, any>;
    searchableFields?: string[]
}

export const queryBuilder = ({ query, searchableFields }: QueryBuiderOptions) => {
    // pagination
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.max(Number(query.limit) || 10, 1);

    const skip = (page - 1) * limit;
    const take = limit;

    // where

    const where: Record<string, any> = {};
    const search = query.search?.toString().trim();

    if (search) {
        where.OR = searchableFields?.map((field) => ({
            [field]: {
                contains: search,
                mode: "insensitive"
            }
        }))
    }

    // filter
    if (query.brand) {
        where.brand = query.brand
    }

    if (query.categoryId) {
        where.categoryId = query.categoryId;
    }

    if (query.isFeatured !== undefined) {
        where.isFeatured = query.isFeatured === "true";
    }

    if (query.status) {
        where.status = query.status
    }

    if (query.minPrice || query.maxPrice) {
        where.basePrice = {
            ...(query.minPrice && {
                gte: Number(query.minPrice),
            }),
            ...(query.maxPrice && {
                lte: Number(query.maxPrice),
            }),
        };
    }

    // sorting 
    const sortableFields = [
        "createdAt",
        "name",
        "basePrice",
    ];

    const sortBy = sortableFields.includes(query.sortBy)
        ? query.sortBy
        : "createdAt";

    const sortOrder =
        query.sortOrder === "asc" ? "asc" : "desc";

    const orderBy = {
        [sortBy]: sortOrder,
    };

    return {
        where,
        orderBy,
        skip,
        take,
        page,
        limit,
    };
}