interface paginationMeta {
    page: number,
    limit: number,
    total: number
}

export const pagination = ({ page, limit, total }: paginationMeta) => {
    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrevious: page > 1
    }
}


