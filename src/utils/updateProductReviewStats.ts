import prisma from "../lib/prisma";

export const updateProductReviewStats = async (productId: string) => {
    const stats = await prisma.productReview.aggregate({
        where: {
            productId
        },
        _avg: {
            rating: true
        },
        _count: {
            rating: true
        }
    })

    await prisma.product.update({
        where: {
            id: productId
        },
        data: {
            averageRating: stats._avg.rating ?? 0,
            reviewCount: stats._count.rating
        }
    })
}