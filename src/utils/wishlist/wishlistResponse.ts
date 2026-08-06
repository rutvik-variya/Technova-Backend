export const wishlistResponse = (wishlist: any[]) => {
    return wishlist.map((item) => ({
        id: item.id,
        createdAt: item.createdAt,

        product: {
            id: item.product.id,
            name: item.product.name,
            slug: item.product.slug,
            brand: item.product.brand,
            basePrice: Number(item.product.basePrice),
            maxPrice: Number(item.product.maxPrice),
            thumbnail: item.product.thumbnail,
            status: item.product.status,
            category: {
                id: item.product.category.id,
                name: item.product.category.name,
            },
        },
    }));
};