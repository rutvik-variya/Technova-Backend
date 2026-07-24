export const categorySelect = {
    id: true,
    name: true,
    slug: true,
    description: true,
    image: true,
    createdAt: true,
    updatedAt: true,
}

export const productSelect = {
    id: true,
    name: true,
    slug: true,
    description: true,
    shortDescription: true,
    brand: true,
    status: true,
    isFeatured: true,
    createdAt: true,
    updatedAt: true,

    category: {
        select: {
            id: true,
            name: true,
            slug: true,
        },
    },
}



