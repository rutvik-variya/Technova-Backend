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
    basePrice: true,
    maxPrice: true,
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
    productImages: {
        select: {
            id: true,
            url: true,
            isPrimary: true,
            displayOrder: true,
        }
    },
    productVariants: {
        select: {
            id: true,
            sku: true,
            ram: true,
            storage: true,
            color: true,
            price: true,
            stock: true
        }
    }
}



