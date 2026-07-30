import prisma from "../lib/prisma";
import { ApiError } from "../utils/ApiError";
import { REVIEW_MESSAGE, createReviewDto, updateReviewDto } from "../types/review.types";
import { updateProductReviewStats } from "../utils/updateProductReviewStats";
import { pagination } from "../utils/pagination";

export const createReviewService = async (
    productId: string,
    userId: string,
    data: createReviewDto
) => {
    const product = await prisma.product.findUnique({
        where: {
            id: productId,
            deletedAt: null,
            status: "ACTIVE"
        },
        select: {
            id: true
        }
    })

    if (!product) {
        throw new ApiError(404, REVIEW_MESSAGE.PRODUCT_NOT_FOUND);
    }

    const existingReview = await prisma.productReview.findUnique({
        where: {
            productId_userId: {
                productId,
                userId
            }
        }
    })

    if (existingReview) {
        throw new ApiError(409, REVIEW_MESSAGE.ALREADY_REVIEWED);
    }

    const review = await prisma.productReview.create({
        data: {
            productId,
            userId,
            rating: data.rating,
            comment: data.comment ?? "",
        },
    });

    await updateProductReviewStats(productId);

    return review
}


export const getReviewsService = async (
    productId: string,
    query: any
) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const skip = (page - 1) * limit;

    const [reviews, total] = await prisma.$transaction([
        prisma.productReview.findMany({
            where: {
                productId,
            },
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc",
            },
            select: {
                id: true,
                rating: true,
                comment: true,
                createdAt: true,

                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        }),

        prisma.productReview.count({
            where: {
                productId,
            },
        }),
    ]);

    return {
        reviews,
        pagination: pagination({
            page,
            limit,
            total,
        }),
    };
};

export const updateReviewService = async (
    reviewId: string,
    user: any,
    data: updateReviewDto
) => {
    const review = await prisma.productReview.findUnique({
        where: {
            id: reviewId,
        },
    });

    if (!review) {
        throw new ApiError(404, REVIEW_MESSAGE.NOT_FOUND);
    }

    if (review.userId !== user.id && user.role !== "ADMIN") {
        throw new ApiError(403, REVIEW_MESSAGE.UNAUTHORIZED);
    }

    const updatedReview =
        await prisma.productReview.update({
            where: {
                id: reviewId,
            },
            data,
        });

    await updateProductReviewStats(review.productId);

    return updatedReview;
};


export const deleteReviewService = async (
    reviewId: string,
    user: any
) => {
    const review = await prisma.productReview.findUnique({
        where: {
            id: reviewId,
        },
    });

    if (!review) {
        throw new ApiError(404, REVIEW_MESSAGE.NOT_FOUND);
    }

    if (review.userId !== user.id && user.role !== "ADMIN") {
        throw new ApiError(403, REVIEW_MESSAGE.UNAUTHORIZED);
    }

    await prisma.productReview.delete({
        where: {
            id: reviewId,
        },
    });

    await updateProductReviewStats(review.productId);
};