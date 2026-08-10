import { queryBuilder } from "../queryBuilder";


export const orderQueryBuilder = (
    userId: string,
    query: Record<string, any>
) => {

    const {
        where: baseWhere,
        orderBy,
        skip,
        take,
        page,
        limit,
    } = queryBuilder({
        query,
        searchableFields: [
            "orderNumber",
        ],
        sortableFields: [
            "createdAt",
            "updatedAt",
            "grandTotal"
        ]

    });

    const where: Record<string, any> = {
        ...baseWhere,
        userId,
    }

    if (query.status) {
        where.status = query.status;
    }

    if (query.paymentStatus) {
        where.paymentStatus =
            query.paymentStatus;
    }

    return {
        where,
        orderBy,
        skip,
        take,
        page,
        limit,
    };
}