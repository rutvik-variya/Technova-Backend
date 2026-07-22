import { INSPECT_MAX_BYTES } from "node:buffer";

interface QueryBuiderOptions {
    query: Record<string, any>;
    searchableFields?: string[]
}

export const queryBuilder = ({ query, searchableFields }: QueryBuiderOptions) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const take = limit;

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

    const sortBy = query.sortBy || "createdAt"
    const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";
    const orderBy = {
        [sortBy]: sortOrder,
    };

    return {
        skip,
        take,
        where,
        orderBy,
        page,
        limit
    }
}