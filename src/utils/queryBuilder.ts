interface QueryBuiderOptions {
    query: Record<string, any>;
    searchableFields?: string[];
    sortableFields?: string[];
}

export const queryBuilder = ({
    query,
    searchableFields = [],
    sortableFields = []
}: QueryBuiderOptions) => {
    // pagination
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.max(Number(query.limit) || 10, 1);

    const skip = (page - 1) * limit;
    const take = limit;

    // where

    const search = query.search?.toString().trim();
    const where: Record<string, any> = {};

    if (
        search &&
        searchableFields &&
        searchableFields.length > 0
    ) {
        where.OR =
            searchableFields.map(
                (field) => ({
                    [field]: {
                        contains: search,
                        mode: "insensitive",
                    },
                })
            );
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
    if (query.orderNumber) {
        where.orderNumber = query.orderNumber
    }
    // sorting 

    const sortBy = sortableFields.includes(query.sortBy)
        ? query.sortBy
        : sortableFields[0];

    const sortOrder =
        query.sortOrder === "asc" ? "asc" : "desc";

    const orderBy = sortBy
        ? {
            [sortBy]: sortOrder,
        }
        : undefined;

    return {
        where,
        orderBy,
        skip,
        take: limit,
        page,
        limit,
    };
}