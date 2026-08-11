import { queryBuilder } from "../queryBuilder"

export const adminOrderQueryBuilder = (
    query: Record<string, any>
) => {
    const queryOptions = queryBuilder({
        query,
        searchableFields: [
            "orderNumber"
        ],
        sortableFields: [
            "createdAt",
            "updatedAt",
            "grandTotal",
        ]
    })

    const where: Record<string, any> = {
        ...queryOptions.where
    }

    if (query.userId) {
        where.userId = query.userId;
    }

    if (query.status) {
        where.status = query.status;
    }

    if (query.paymentStatus) {
        where.paymentStatus = query.paymentStatus;
    }

    if (query.paymentMethod) {
        where.paymentMethod = query.paymentMethod;
    }

    if (query.startDate || query.endDate) {
        where.createdAt = {}
        if (query.startDate) {
            where.createdAt.gte = new Date(query.startDate);
        }

        if (query.endDate) {
            const endDate = new Date(query.endDate);

            endDate.setHours(
                23,
                59,
                59,
                999
            );

            where.createdAt.lte = endDate;
        }
    }

    return {
        ...queryOptions,
        where
    }
} 